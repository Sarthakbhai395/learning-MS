// src/components/Navbar.jsx
import { CreditCard, LogOut, Menu, School, Settings, User, HelpCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios'; // Add axios for API calls

// UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkMode from './DarkMode';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from '@radix-ui/react-dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data for Q&A (with correct answers for marking)
const qaData = [
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is 2 + 2?", answer: "4" },
  { question: "Who wrote 'To Kill a Mockingbird'?", answer: "Harper Lee" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
  { question: "What is the chemical symbol for water?", answer: "H2O" },
  { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
  { question: "What is the smallest country in the world?", answer: "Vatican City" },
  { question: "What is the boiling point of water?", answer: "100°C" },
  { question: "Who discovered gravity?", answer: "Isaac Newton" },
  { question: "What is the currency of Japan?", answer: "Yen" },
  { question: "What is the tallest mountain in the world?", answer: "Mount Everest" },
  { question: "What gas do plants use for photosynthesis?", answer: "Carbon Dioxide" },
  { question: "Who was the first person on the moon?", answer: "Neil Armstrong" },
  { question: "What is the longest river in the world?", answer: "Nile River" },
  { question: "What is the primary source of energy for Earth?", answer: "The Sun" },
  { question: "What is the capital of Australia?", answer: "Canberra" },
  { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean" },
  { question: "Who invented the telephone?", answer: "Alexander Graham Bell" },
  { question: "What is the hardest natural substance?", answer: "Diamond" },
  { question: "What is the capital of Brazil?", answer: "Brasília" },
  { question: "What is the main language spoken in Spain?", answer: "Spanish" },
  { question: "What is the largest mammal?", answer: "Blue Whale" },
  { question: "What is the capital of India?", answer: "New Delhi" },
  { question: "What is the freezing point of water?", answer: "0°C" },
  { question: "Who wrote 'Pride and Prejudice'?", answer: "Jane Austen" },
];

// Function to get 20 random Q&A pairs
const getRandomQA = () => {
  const shuffled = qaData.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 20);
};

// Certification Form Component
function CertificationForm({ onClose, userName, marks, totalMarks }) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Congratulations, {userName}!</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p>You have successfully completed the Q&A form!</p>
        <p>Your Score: {marks} out of {totalMarks}</p>
        <p>This is your certification of completion.</p>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </DialogContent>
  );
}

function QnAForm({ onClose, userName, userId }) {
  const [qaList, setQaList] = useState(getRandomQA());
  const [answers, setAnswers] = useState(Array(qaList.length).fill('')); // Initialize with empty strings
  const [isCertificationOpen, setIsCertificationOpen] = useState(false); // State for certification dialog

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if all fields are filled
    const allFieldsFilled = answers.every((answer) => answer.trim() !== '');
    if (!allFieldsFilled) {
      toast.error("Please fill in all answers before submitting!");
      return;
    }

    // Calculate marks
    let marks = 0;
    const totalMarks = qaList.length;
    answers.forEach((answer, index) => {
      if (answer.trim().toLowerCase() === qaList[index].answer.toLowerCase()) {
        marks += 1;
      }
    });

    // Submit to backend
    try {
      await axios.post('http://localhost:5000/api/qna/submit', {
        userId,
        userName,
        marks,
        totalMarks,
      });
      toast.success("Form submitted successfully!");
      setIsCertificationOpen(true); // Open certification dialog
    } catch (error) {
      toast.error("Error submitting form: " + error.message);
    }
  };

  return (
    <>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Q&A Form</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {qaList.map((qa, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`question-${index}`}>
                {index + 1}. {qa.question}
              </Label>
              <Input
                id={`question-${index}`}
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Enter your answer"
              />
            </div>
          ))}
          <Button type="submit" className="w-full mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>

      {/* Certification Dialog */}
      <Dialog open={isCertificationOpen} onOpenChange={setIsCertificationOpen}>
        <CertificationForm
          userName={userName}
          marks={answers.reduce((marks, answer, index) => marks + (answer.trim().toLowerCase() === qaList[index].answer.toLowerCase() ? 1 : 0), 0)}
          totalMarks={qaList.length}
          onClose={() => {
            setIsCertificationOpen(false);
            onClose(); // Close the Q&A dialog after certification dialog closes
          }}
        />
      </Dialog>
    </>
  );
}

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const [isQnAOpen, setIsQnAOpen] = useState(false); // State to control Q&A dialog

  // Debugging: Log the user object to check if it's being set correctly
  console.log("User in Navbar:", user);

  const logoutHandler = async () => {
    await logoutUser();
    // Clear localStorage to align with the provided code
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User Logout successfully");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  // Get the user's name and ID from the Redux state
  const userName = user ? user.name || "User" : "Guest";
  const userId = user ? user._id : null;

  return (
    <div className="h-16 bg-white dark:bg-[#0a0a0a] border-b dark:border-b-gray-800 fixed top-0 right-0 left-0 z-10 duration-300">
      {/* Desktop View */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center h-full px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <School size={25} className="text-black dark:text-white" />
          <Link to="/">
            <h1 className="hidden md:block font-bold text-2xl text-black dark:text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text animate-pulse">
              E-Learning
            </h1>
          </Link>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-6">
          {/* Explore Button */}
          <Link to="/courses">
            <Button
              variant="outline"
              className="bg-[#03dac6] text-white hover:bg-[#018786] transition-colors duration-300 rounded-md px-4 py-2"
            >
              Explore Courses
            </Button>
          </Link>

          {/* Q&A Button */}
          <Dialog open={isQnAOpen} onOpenChange={setIsQnAOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#03dac6] text-white hover:bg-[#018786] transition-colors duration-300 rounded-md px-4 py-2 flex items-center gap-2"
              >
                <HelpCircle size={16} />
                Q&A
              </Button>
            </DialogTrigger>
            <QnAForm onClose={() => setIsQnAOpen(false)} userName={userName} userId={userId} />
          </Dialog>

          {/* Exam Dashboard Button - Only for Logged-In Users */}
          {user ? (
            <Link to="/exam-dashboard">
              <Button
                variant="outline"
                className="bg-[#03dac6] text-white hover:bg-[#018786] transition-colors duration-300 rounded-md px-4 py-2"
              >
                Exam Dashboard
              </Button>
            </Link>
          ) : (
            // Debugging: Log when the user is not logged in
            console.log("User is not logged in, Exam Dashboard button will not be shown.")
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="Profile" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/my-learning">My Learning</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/edit-profile">Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logoutHandler}>Log Out</DropdownMenuItem>

                {/* Admin Dashboard Link */}
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="bg-pink-400 w-full text-white font-bold text-center">
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/login")}>Sign Up</Button>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <Button size="icon" className="rounded-full bg-gray-200 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700">
            <DarkMode />
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex h-full w-full items-center justify-between md:hidden px-4">
        <div className="flex items-center">
          <School size={25} className="text-black dark:text-white" />
          <h1 className="font-bold text-2xl text-black dark:text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text animate-pulse">
            E-Learning
          </h1>
        </div>
        <MobileNavbar user={user} isQnAOpen={isQnAOpen} setIsQnAOpen={setIsQnAOpen} />
      </div>
    </div>
  );
}

function MobileNavbar({ user, isQnAOpen, setIsQnAOpen }) {
  const navigate = useNavigate();
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
    // Clear localStorage to align with the provided code
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User Logout successfully");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full bg-gray-200 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white dark:bg-gray-900">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="text-black dark:text-white">E-Learning</SheetTitle>
          <DarkMode />
        </SheetHeader>

        <Separator className="my-4" />

        {/* Mobile Navigation */}
        <nav className="flex flex-col space-y-4">
          <Link to="/courses" className="hover:text-gray-500 text-black dark:text-white">Explore Courses</Link>
          {/* Q&A Button for Mobile */}
          <Dialog open={isQnAOpen} onOpenChange={setIsQnAOpen}>
            <DialogTrigger asChild>
              <button className="hover:text-gray-500 text-black dark:text-white flex items-center gap-2">
                <HelpCircle size={16} />
                Q&A
              </button>
            </DialogTrigger>
            <QnAForm onClose={() => setIsQnAOpen(false)} userName={user?.name || "Guest"} userId={user?._id} />
          </Dialog>
          <Link to="/my-learning" className="hover:text-gray-500 text-black dark:text-white">My Learning</Link>
          <Link to="/edit-profile" className="hover:text-gray-500 text-black dark:text-white">Edit Profile</Link>
          {/* Exam Dashboard Link for Mobile - Only for Logged-In Users */}
          {user && (
            <Link to="/exam-dashboard" className="hover:text-gray-500 text-black dark:text-white">
              Exam Dashboard
            </Link>
          )}
          {user && (
            <button onClick={logoutHandler} className="hover:text-gray-500 text-black dark:text-white">
              Logout
            </button>
          )}
        </nav>

        {/* Instructor Dashboard (Mobile) */}
        {user?.role === "instructor" && (
          <SheetClose asChild>
            <Button className="mt-6 w-full">Dashboard</Button>
          </SheetClose>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default Navbar;