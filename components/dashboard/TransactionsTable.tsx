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
import { useDeleteTransactionAdminMutation } from "@/app/store/services/admin";
import { Transaction } from "@/app/store/services/transaction";
import { toast } from "sonner";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
}) => {
  const [deleteTransaction] = useDeleteTransactionAdminMutation();

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId).unwrap();
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete transaction");
    }
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction._id}>
            <TableCell>{transaction.type}</TableCell>
            <TableCell>${transaction.amount.toFixed(2)}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              {new Date(transaction.date).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTransaction(transaction._id)}
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
