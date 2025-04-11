import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDeleteExpenseAdminMutation } from "@/app/store/services/admin";
import { Expense } from "@/app/store/services/expenseApi";
import { toast } from "sonner";

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  isLoading,
}) => {
  const [deleteExpense] = useDeleteExpenseAdminMutation();

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId).unwrap();
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete expense");
    }
  };

  if (isLoading) {
    return <div>Loading expenses...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense._id}>
            <TableCell>{expense.description}</TableCell>
            <TableCell>${expense.amount.toFixed(2)}</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteExpense(expense._id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
