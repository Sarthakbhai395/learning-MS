import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion"; // Import framer-motion for animation

export function Login() {
  const [signup, setSignup] = useState({ name: "", email: "", password: "", role: "" });
  const [login, setLogin] = useState({ email: "", password: "", role: "" });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false); // State to manage dropdown visibility
  const [activeTab, setActiveTab] = useState("Signup"); // State to control the active tab
  const navigate = useNavigate();

  const [
    registeruser,
    { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess },
  ] = useLoginUserMutation();

  // Sync login state and switch to Login tab after successful signup
  useEffect(() => {
    if (registerIsSuccess && registerData) {
      setLogin({
        email: signup.email,
        password: signup.password,
        role: signup.role,
      });
      setTimeout(() => {
        setActiveTab("Login"); // Switch to Login tab
        toast.success("Signup successful! Please log in.");
      }, 300); // Small delay for user feedback
    }
  }, [registerIsSuccess, registerData, signup.email, signup.password, signup.role]);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignup((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setSignup((prev) => ({ ...prev, role }));
    setLogin((prev) => ({ ...prev, role })); // Sync role with login state
    setShowRoleDropdown(false); // Close dropdown after selection
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", signup);
    await registeruser(signup);
    if (registerError) {
      console.error("Signup Error:", registerError);
      toast.error(`Signup failed: ${registerError?.data?.message || "Unknown error"}`);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Data:", login);
    try {
      const response = await loginUser(login).unwrap(); // Unwrap ensures you get the response data
      if (response) {
        toast.success("Login successful! Welcome");
        navigate("/"); // Navigate to homepage
      }
    } catch (error) {
      console.error("Login Error Details:", error);
      toast.error(`Login failed: ${error?.data?.message || "Invalid credentials or role"}`);
    }
  };

  // Animation variants for the tab content
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Signup">Signup</TabsTrigger>
          <TabsTrigger value="Login">Login</TabsTrigger>
        </TabsList>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          key={activeTab} // Ensures animation triggers on tab change
        >
          <TabsContent value="Signup">
            <Card>
              <form onSubmit={handleSignupSubmit}>
                <CardHeader>
                  <CardTitle>Signup</CardTitle>
                  <CardDescription>
                    Create an account to access your dashboard and chat.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Coder"
                    value={signup.name}
                    onChange={handleSignupChange}
                    required
                  />
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ex@gmail.com"
                    value={signup.email}
                    onChange={handleSignupChange}
                    required
                  />
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="@peduarte"
                    value={signup.password}
                    onChange={handleSignupChange}
                    required
                  />
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <Input
                      id="role"
                      name="role"
                      type="text"
                      placeholder="Select Role"
                      value={signup.role || ""}
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      readOnly
                    />
                    {showRoleDropdown && (
                      <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                        <div className="p-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="role"
                              value="instructor"
                              checked={signup.role === "instructor"}
                              onChange={() => handleRoleChange("instructor")}
                            />
                            <span>Instructor</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="role"
                              value="user"
                              checked={signup.role === "user"}
                              onChange={() => handleRoleChange("user")}
                            />
                            <span>User</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                {registerError && (
                  <p className="text-red-500">
                    {registerError?.data?.message || "Signup failed"}
                  </p>
                )}
                <CardFooter>
                  <Button disabled={registerIsLoading} type="submit" className="hover:bg-gray-200">
                    {registerIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                      </>
                    ) : (
                      "SignUp"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="Login">
            <Card>
              <form onSubmit={handleLoginSubmit}>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Login to access your dashboard and chat.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="current">Email</Label>
                  <Input
                    id="current"
                    name="email"
                    type="email"
                    placeholder="ex@gmail.com"
                    value={login.email}
                    onChange={handleLoginChange}
                    required
                  />
                  <Label htmlFor="new">Password</Label>
                  <Input
                    id="new"
                    name="password"
                    type="password"
                    placeholder="@peduarte"
                    value={login.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <Input
                      id="role"
                      name="role"
                      type="text"
                      placeholder="Select Role"
                      value={login.role || ""}
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      readOnly
                    />
                    {showRoleDropdown && (
                      <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                        <div className="p-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="role"
                              value="instructor"
                              checked={login.role === "instructor"}
                              onChange={() => handleRoleChange("instructor")}
                            />
                            <span>Instructor</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="role"
                              value="user"
                              checked={login.role === "user"}
                              onChange={() => handleRoleChange("user")}
                            />
                            <span>User</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                {loginError && (
                  <p className="text-red-500">
                    {loginError?.data?.message || "Login failed"}
                  </p>
                )}
                <CardFooter>
                  <Button disabled={loginIsLoading} type="submit" className="hover:bg-gray-200">
                    {loginIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}