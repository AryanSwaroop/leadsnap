"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Mail, Phone, ExternalLink, Star } from "lucide-react";

interface Lead {
  id: number;
  companyName: string;
  industry: string;
  sponsorshipHistory: string;
  engagementScore: number;
  contactStatus: string;
  actions: string[];
}

interface LeadTableProps {
  query: string; // Define query type
}

export function LeadTable({ query }: LeadTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!query) return; // Prevent unnecessary API calls when query is empty

    const fetchLeads = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post("http://0.0.0.0:8000/search_leads/", { query });
        setLeads(response.data.leads || []);
      } catch (err) {
        setError("Failed to fetch leads. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [query]);

  return (
    <div className="w-full overflow-auto">
      {loading && <p className="text-center">Loading leads...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium">Company Name</TableHead>
            <TableHead className="text-xs font-medium">Industry</TableHead>
            <TableHead className="text-xs font-medium">Sponsorship History</TableHead>
            <TableHead className="text-xs font-medium">Engagement Score</TableHead>
            <TableHead className="text-xs font-medium">Contact Status</TableHead>
            <TableHead className="text-xs font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="hover:bg-muted/50">
              <TableCell className="text-xs">{lead.companyName}</TableCell>
              <TableCell className="text-xs">{lead.industry}</TableCell>
              <TableCell className="text-xs">{lead.sponsorshipHistory}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(lead.engagementScore) ? "fill-yellow text-yellow" : "text-muted"
                          }`}
                        />
                      ))}
                  </div>
                  <span className="ml-1 text-xs">({lead.engagementScore.toFixed(1)})</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    lead.contactStatus === "Contacted"
                      ? "border-blue text-blue"
                      : lead.contactStatus === "Deal Closed"
                      ? "border-green-500 text-green-500"
                      : "border-muted text-muted-foreground"
                  }`}
                >
                  {lead.contactStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Mail className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
