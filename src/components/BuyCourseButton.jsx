import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutMutation } from "@/features/api/purchaseApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function BuyCourseButton({ courseId }) {
  const [createCheckout, { isLoading, error, isError }] = useCreateCheckoutMutation();

  const purchaseCourseHandler = async () => {
    try {
      const response = await createCheckout(courseId)
      console.log("Response from backend:", response);  // Debugging step

      if (!response?.data?.order) {
        return toast.error("Failed to create Razorpay order.");
      }

      const { id, amount, currency } = response.data.order;

      const options = {
        key: "rzp_test_AsXAGf46NwrkBC", // Razorpay key ID
        amount,
        currency,
        name: "Course Purchase",
        description: "Complete your payment to enroll",
        order_id: id,
        prefill: { name: "John Doe", email: "john.doe@example.com", contact: "9999999999" },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
      console.log("open razorpay")
    } catch (err) {
      console.log("Error in purchaseCourseHandler:", err); // Log the full error object
      toast.error("Error processing payment. Please try again.");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  }, [isError, error]);

  return (
    <Button className="w-full" onClick={purchaseCourseHandler} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
}

export default BuyCourseButton;
