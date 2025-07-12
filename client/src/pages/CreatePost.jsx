import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Save, LogOut } from "lucide-react";
import BlogHeader from "@/components/BlogHeader";
import { postService } from "@/services/api";
import { authService } from "@/services/api";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? e.target.checked : value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await postService.createPost(postData);
      console.log("Post created successfully:", response);
      
      // On success, redirect to the new post or posts list
      navigate('/');
      
    } catch (error) {
      console.error("Post creation error:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        setError(error.response.data?.message || `Failed to create post: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        setError("No response from server. Please check your connection.");
      } else {
        // Something else happened
        setError(error.message || "Failed to create post. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      // Notify other components that user has logged out
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <BlogHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">
                {previewMode ? "Preview Post" : "Create New Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!previewMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter your post title..."
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      placeholder="Write a brief description of your post..."
                      value={formData.excerpt}
                      onChange={handleChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Write your post content here... (You can use HTML tags)"
                      value={formData.content}
                      onChange={handleChange}
                      rows={15}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      You can use HTML tags for formatting (h2, h3, p, ul, li, strong, em, code, pre, etc.)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      type="text"
                      placeholder="React, TypeScript, Web Development (comma-separated)"
                      value={formData.tags}
                      onChange={handleChange}
                    />
                    <p className="text-sm text-gray-500">
                      Separate tags with commas
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="featured">Featured Post</Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      "Publishing..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Publish Post
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Preview */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {formData.title || "Your Post Title"}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {formData.excerpt || "Your post excerpt will appear here..."}
                    </p>
                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tagsArray.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {formData.featured && (
                      <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full mb-4">
                        Featured Post
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-6">
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: formData.content || "<p>Your post content will appear here...</p>" 
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;