import React from 'react';

export function UserProfileAbout() {
    // Dummy data for now
    const user = {
        name: "Neeraj Kawadkar",
        role: "Admin",
        email: "xyz@company.com",
    };

    return (
        <div className="rounded-lg h-fit border border-[#e4e7ec] bg-white p-6">
            <h2 className="text-lg font-semibold text-[#101828] mb-4">About</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                    <div className="text-[#667085]">Name</div>
                    <div className="text-[#101828] font-medium">{user.name}</div>
                </div>
                <div>
                    <div className="text-[#667085]">Role</div>
                    <div className="text-[#101828] font-medium">{user.role}</div>
                </div>
                <div>
                    <div className="text-[#667085]">Registered Email</div>
                    <div className="text-[#101828] font-medium">{user.email}</div>
                </div>
            </div>
        </div>
    );
}
