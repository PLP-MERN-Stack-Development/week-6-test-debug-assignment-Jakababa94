const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const Post = require('../../src/models/Post');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/utils/auth');

let mongoServer;
let token;
let userId;
let postId;
let categoryId;

jest.setTimeout(120000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});

  // Create user and token
  const user = new User({
    name: 'testuser',
    email: 'test@example.com',
    password: 'password123', 
  });
  await user.save();

  userId = user._id;
  token = generateToken(user);

  // Create reusable category ID
  categoryId = mongoose.Types.ObjectId();

  // Create one default post
  const post = await Post.create({
    title: 'Test Post',
    content: 'This is a test post content',
    author: userId,
    category: categoryId,
    slug: 'test-post',
  });

  postId = post._id;
});

describe('POST /api/posts', () => {
  it('should create a new post when authenticated', async () => {
    const newPost = {
      title: 'New Test Post',
      content: 'This is a new test post content',
      category: categoryId.toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newPost.title);
    expect(res.body.content).toBe(newPost.content);
    expect(res.body.author).toBe(userId.toString());
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        title: 'Unauthorized Post',
        content: 'This should not be created',
        category: categoryId.toString(),
      });

    expect(res.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Missing title',
        category: categoryId.toString(),
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter posts by category', async () => {
    const newCategory = mongoose.Types.ObjectId();

    await Post.create({
      title: 'Filtered Post',
      content: 'Filter by category',
      author: userId,
      category: newCategory,
      slug: 'filtered-post',
    });

    const res = await request(app)
      .get(`/api/posts?category=${newCategory.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category).toBe(newCategory.toString());
  });

  it('should paginate results', async () => {
    const posts = [];
    for (let i = 0; i < 15; i++) {
      posts.push({
        title: `Pagination Post ${i}`,
        content: `Post ${i} content`,
        author: userId,
        category: mongoose.Types.ObjectId(),
        slug: `pagination-post-${i}`,
      });
    }
    await Post.insertMany(posts);

    const page1 = await request(app).get('/api/posts?page=1&limit=10');
    const page2 = await request(app).get('/api/posts?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.length).toBe(10);
    expect(page2.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/posts/:id', () => {
  it('should return a post by ID', async () => {
    const res = await request(app).get(`/api/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(postId.toString());
  });

  it('should return 404 if not found', async () => {
    const res = await request(app)
      .get(`/api/posts/${mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/posts/:id', () => {
  it('should update a post when authenticated as author', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title', content: 'Updated Content' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .send({ title: 'Fail Update' });

    expect(res.status).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    const otherUser = new User({
      name: 'otheruser',
      email: 'other@example.com',
      password: 'password123',
    });
    await otherUser.save();
    const otherToken = generateToken(otherUser);

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacker Update' });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post as author', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const deleted = await Post.findById(postId);
    expect(deleted).toBeNull();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).delete(`/api/posts/${postId}`);
    expect(res.status).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    const otherUser = new User({
      name: 'otheruser2',
      email: 'other2@example.com',
      password: 'password123',
    });
    await otherUser.save();
    const otherToken = generateToken(otherUser);

    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer invalid.token.here`);

    expect(res.status).toBe(401);
  });
});
