"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import withAuth from "@/HOC/withAuth";
import { useAuth } from "@/contexts/auth-context"; // Import auth context
import { toast } from "@/hooks/use-toast";

const StocksTable = () => {
  const { user } = useAuth(); // Get user from auth context
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state for the page
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasErrors, setHasErrors] = useState(false); // Track validation errors
  const [isSaving, setIsSaving] = useState(false); // Loading state for save

  // Fetch user's portfolio on load or after user changes
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user || !user.userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/portfolio?userId=${user.userId}`);
        if (response.ok) {
          const portfolio = await response.json();
          const stocksWithIds = portfolio.stocks.map((stock, index) => ({
            id: index.toString(), // Generate a unique ID for each stock
            ...stock,
          }));
          setData(stocksWithIds); // Populate table with fetched data
          setOriginalData(stocksWithIds); // Track original data for comparison
        } else if (response.status === 404) {
          // Initialize empty data if no portfolio exists
          setData([]);
          setOriginalData([]);
        } else {
          const errorData = await response.json();
          toast({
            title: "Error Fetching Portfolio",
            description: errorData.message || "Could not load portfolio.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Network Error",
          description: "Unable to fetch portfolio.",
          variant: "destructive",
        });
      } finally {
        setLoading(false); // End loading spinner
      }
    };

    fetchPortfolio();
  }, [user]);

  // Track changes and validation
  useEffect(() => {
    const isModified = JSON.stringify(data) !== JSON.stringify(originalData);
    const hasInvalidRows = data.some(
      (row) => row.ticker.trim() === "" || row.amount <= 0
    );
    setHasChanges(isModified);
    setHasErrors(hasInvalidRows);
  }, [data, originalData]);

  const handleEdit = (id, field, value) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]:
                field === "amount"
                  ? value.replace(/^0+(?!$)/, "") // Remove leading zeros
                  : value,
            }
          : row
      )
    );
  };

  const handleDelete = (id) => {
    setDeleteRowId(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (deleteRowId) {
      setData((prev) => prev.filter((row) => row.id !== deleteRowId));
      setShowConfirmation(false);
      setDeleteRowId(null);
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: (data.length + 1).toString(),
      ticker: "",
      amount: 0,
    };
    setData((prev) => [...prev, newRow]);
  };

  const handleSave = async () => {
    if (!user || !user.userId) {
      toast({
        title: "Error",
        description: "User is not logged in. Please log in again.",
        variant: "destructive",
      });
      console.error("User ID is missing. Cannot save portfolio.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          stocks: data.map(({ ticker, amount }) => ({
            ticker: ticker.trim(),
            amount: parseFloat(amount),
          })),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Portfolio Saved",
          description: result.message || "Your portfolio has been updated.",
        });
        setOriginalData([...data]); // Update original data
        setHasChanges(false); // Reset changes tracker
      } else {
        const errorData = await response.json();
        toast({
          title: "Save Failed",
          description: errorData.message || "An error occurred while saving.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to connect to the server.",
        variant: "destructive",
      });
      console.error("Save Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div>Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-2">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">My Stocks</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={row.ticker}
                    onChange={(e) =>
                      handleEdit(row.id, "ticker", e.target.value)
                    }
                    className={`border rounded p-1 w-full ${
                      row.ticker.trim() === "" ? "border-red-500" : ""
                    }`}
                    placeholder="Enter Ticker"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) =>
                      handleEdit(row.id, "amount", e.target.value)
                    }
                    className={`border rounded p-1 w-full ${
                      row.amount <= 0 ? "border-red-500" : ""
                    }`}
                    placeholder="Enter Amount"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(row.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        <Button className="mt-4 w-full" onClick={handleAddRow}>
          Add New Item
        </Button>
  
        {hasChanges && !hasErrors && (
          <Button
            className="mt-4 w-full bg-green-500 text-white hover:bg-green-600"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
  
        {showConfirmation && (
          <Alert>
            <div className="flex flex-col">
              <p>Are you sure you want to delete this item?</p>
              <div className="flex gap-2 mt-2">
                <Button onClick={confirmDelete}>Yes</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                >
                  No
                </Button>
              </div>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default withAuth(StocksTable);