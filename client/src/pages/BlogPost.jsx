import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Eye } from "lucide-react";
import BlogHeader from "@/components/BlogHeader";
import { postService } from "@/services/api";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await postService.getPost(id);
        setPost(postData);
      } catch (err) {
        setError("Error loading post");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const newComment = await postService.addComment(id, { text: commentText });
      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <BlogHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <BlogHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Error loading post</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <BlogHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Post not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BlogHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4" />
              {formatDate(post.createdAt)}
              <User className="h-4 w-4 ml-2" />
              {post.author?.name || "Unknown Author"}
              {post.views && (
                <>
                  <Eye className="h-4 w-4 ml-2" />
                  {post.views}
                </>
              )}
            </div>
            <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
            {post.excerpt && (
              <CardDescription className="text-lg">
                {post.excerpt}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            </div>

            {/* Comments Section */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Comments</h3>
              
              {/* Add Comment Form */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddComment}>
                    Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments?.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">
                        {comment.author?.name || "Anonymous"}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
                
                {(!post.comments || post.comments.length === 0) && (
                  <p className="text-gray-500 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BlogPost;
