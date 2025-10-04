"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { showToast } from "../ui/toast-manager";
import { editLeadAPI, getAllUsers } from "@/services/clients";
import {
  ClientType,
  EditableClient,
  RMUser,
} from "@/constants/types";

type Props = {
  id?: string;
  client: ClientType;
  open: boolean;
  setOpen: (value: boolean) => void;
  refreshClients: () => void;
};

export default function EditLead({
  id,
  client,
  open,
  setOpen,
  refreshClients,
}: Props) {
  const [sending, setSending] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [assignedRM, setAssignedRM] = useState<string>(""); // Default value
  const [countryCode, setCountryCode] = useState("IND (+91)");

  useEffect(() => {
    if (open && client) {
      setFirstName(client.first_name || "");
      setLastName(client.last_name || "");
      setEmail(client.email || "");
      setPhoneNumber(client.phone_number || "");
      setAssignedRM(client.assigned_rm?.email || "admin@finora.com"); // Assuming assigned_rm has an id
    }
  }, [open, client]);

  const [rms, setRms] = useState<RMUser[]>([]);

  useEffect(() => {
    const fetchRms = async () => {
      try {
        const data = await getAllUsers();
        setRms(data);
        console.log("Fetched RMs:", data);
      } catch (error) {
        console.error("Failed to fetch RM list:", error);
      }
    };

    fetchRms();
  }, []);

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }
  const isValidIndianPhone = (phoneNumber: string): boolean => {
    return /^[6-9]\d{9}$/.test(phoneNumber);
  };
  function isValidIndianName(name: string): boolean {
    const regex = /^[A-Za-z\s\-]+$/;
    return regex.test(name.trim());
  }

  async function handleSubmit() {
    let editedLead: EditableClient = {};
    if (!id?.trim()) {
      showToast({
        title: "Error",
        description: "ID not found",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (
      !firstName.trim() &&
      !lastName.trim() &&
      email.trim() &&
      !isValidEmail(email) &&
      !phoneNumber.trim()
    ) {
      showToast({
        title: "No Value Added",
        description: "Please Add a new value",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    if (firstName.trim() && !isValidIndianName(firstName.trim())) {
      showToast({
        title: "Invalid First Name",
        description: "Please add First Name in correct format",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    if (lastName.trim() && !isValidIndianName(lastName.trim())) {
      showToast({
        title: "Invalid Last Name",
        description: "Please add Last Name in correct format",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    if (phoneNumber && !isValidIndianPhone(phoneNumber.trim())) {
      showToast({
        title: "Phone number not valid",
        description: "Please Add a correct phone number value",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    editedLead = {
      ...(firstName !== client.first_name ? { first_name: firstName } : {}),
      ...(lastName !== client.last_name ? { last_name: lastName } : {}),
      ...(email !== client.email ? { email } : {}),
      ...(assignedRM !== client.assigned_rm?.email
        ? { assigned_rm: assignedRM }
        : {}),
      ...(phoneNumber !== client.phone_number
        ? { phone_number: phoneNumber }
        : {}),
    };

    setSending(true);
    try {
      const response = await editLeadAPI(editedLead, id);
      showToast({
        title: "Success",
        description: "Lead Editted!",
        type: "success",
      });
      refreshClients();
    } catch (e) {
      showToast({
        title: "Error",
        description: "Lead could not be created!",
        type: "error",
      });
    } finally {
      setSending(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setOpen(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl">
        <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-md font-medium text-[#101828]">
            Edit lead(s)
          </DialogTitle>
        </DialogHeader>

        <Tabs className="w-full">
          <div className="grid grid-cols-2 gap-4 px-6 pb-1">
            <div>
              <Label
                htmlFor="first-name"
                className="text-sm font-medium text-[#344054] mb-1 block"
              >
                First name
              </Label>
              <Input
                id="first-name"
                className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="last-name"
                className="text-sm font-medium text-[#344054] mb-1 block"
              >
                Last name{" "}
              </Label>
              <Input
                id="last-name"
                className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[#344054] mb-1 block"
              >
                Email
              </Label>
              <Input
                id="email"
                className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="phone-number"
                className="text-sm font-medium text-[#344054] mb-1 block"
              >
                Phone number
              </Label>
              <div className="flex">
                <Select value="+91" onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[103px] !h-10 gap-0 rounded-r-none border-r-0 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                    <SelectValue>IND (+91)</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">IND (+91)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  className="flex-1 h-10 rounded-l-none border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1 px-6 pb-6">
            <Label
              htmlFor="assigned-rm"
              className="text-sm font-medium text-[#344054] block"
            >
              Assigned RM
            </Label>
            <Select value={assignedRM} onValueChange={setAssignedRM}>
              <SelectTrigger className="w-full h-10 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select RM" />
              </SelectTrigger>
              <SelectContent>
                {rms.map((rm) => (
                  <SelectItem key={rm.id} value={rm.email}>
                    {rm.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tabs>
        <div className="border-t border-[#e4e7ec] px-6 pb-4  flex flex-col gap-4 items-center justify-between">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg bg-[#7f56d9] text-white hover:bg-[#6941c6]"
          >
            <span>{sending ? "Editting..." : "Edit"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
