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
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("Signup");
  const navigate = useNavigate();

  const roles = ["user", "instructor", "admin"]; // Add admin role to the list

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
      const response = await loginUser(login).unwrap();
      if (response) {
        toast.success("Login successful! Welcome");
        navigate("/")
        // Navigate based on role
        // if (response.user.role === "admin") {
        //   navigate("/admin/dashboard");
        // } else if (response.user.role === "instructor") {
        //   navigate("/instructor/dashboard");
        // } else {
        //   navigate("/student/dashboard");
        // }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to LMS</CardTitle>
          <CardDescription>Login or Signup to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Signup">Signup</TabsTrigger>
              <TabsTrigger value="Login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="Signup">
              <form onSubmit={handleSignupSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={signup.name}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={signup.email}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={signup.password}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      >
                        {signup.role || "Select Role"}
                      </Button>
                      {showRoleDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                          {roles.map((role) => (
                            <button
                              key={role}
                              type="button"
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() => handleRoleChange(role)}
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={registerIsLoading}>
                    {registerIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing up...
                      </>
                    ) : (
                      "Signup"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="Login">
              <form onSubmit={handleLoginSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="loginEmail">Email</Label>
                    <Input
                      id="loginEmail"
                      name="email"
                      type="email"
                      value={login.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="loginPassword">Password</Label>
                    <Input
                      id="loginPassword"
                      name="password"
                      type="password"
                      value={login.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      >
                        {login.role || "Select Role"}
                      </Button>
                      {showRoleDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                          {roles.map((role) => (
                            <button
                              key={role}
                              type="button"
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() => handleRoleChange(role)}
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loginIsLoading}>
                    {loginIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}