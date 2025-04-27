import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function PaymentManagement() {
  const [transactions, setTransactions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expiryDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, couponsRes] = await Promise.all([
        fetch("/api/v1/payment/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch("/api/v1/payment/coupons", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      const [transactionsData, couponsData] = await Promise.all([
        transactionsRes.json(),
        couponsRes.json(),
      ]);

      if (transactionsData.success) {
        setTransactions(transactionsData.transactions);
      }
      if (couponsData.success) {
        setCoupons(couponsData.coupons);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (transactionId) => {
    try {
      const response = await fetch(`/api/v1/payment/refund/${transactionId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Refund processed successfully");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to process refund");
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/payment/coupon", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCoupon),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Coupon created successfully");
        setNewCoupon({ code: "", discount: "", expiryDate: "" });
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to create coupon");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Manage payments and refunds</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.user.name}</TableCell>
                  <TableCell>{transaction.course.title}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "refunded"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {transaction.status === "completed" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRefund(transaction._id)}
                      >
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coupon Management</CardTitle>
          <CardDescription>Create and manage discount coupons</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCoupon} className="space-y-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Coupon Code</Label>
                <Input
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discount: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={newCoupon.expiryDate}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <Button type="submit">Create Coupon</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon._id}>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.discount}%</TableCell>
                  <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        new Date(coupon.expiryDate) > new Date()
                          ? "default"
                          : "destructive"
                      }
                    >
                      {new Date(coupon.expiryDate) > new Date() ? "Active" : "Expired"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentManagement; 