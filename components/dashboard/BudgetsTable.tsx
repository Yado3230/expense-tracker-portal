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
import { useDeleteBudgetAdminMutation } from "@/app/store/services/admin";
import { Budget } from "@/app/store/services/budget";
import { toast } from "sonner";

interface BudgetsTableProps {
  budgets: Budget[];
  isLoading: boolean;
}

export const BudgetsTable: React.FC<BudgetsTableProps> = ({
  budgets,
  isLoading,
}) => {
  const [deleteBudget] = useDeleteBudgetAdminMutation();

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId).unwrap();
      toast.success("Budget deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete budget");
    }
  };

  if (isLoading) {
    return <div>Loading budgets...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets.map((budget) => (
          <TableRow key={budget._id}>
            <TableCell>{budget.category}</TableCell>
            <TableCell>${budget.limit.toFixed(2)}</TableCell>
            <TableCell>
              {new Date(budget.startDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {new Date(budget.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteBudget(budget._id)}
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
