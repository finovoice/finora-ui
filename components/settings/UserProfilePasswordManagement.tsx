import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { adminPasswordReset } from '@/services/admin';

export function UserProfilePasswordManagement() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifyNewPassword, setVerifyNewPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters';
        }
        if (!verifyNewPassword) {
            newErrors.verifyNewPassword = 'Verification is required';
        } else if (newPassword !== verifyNewPassword) {
            newErrors.verifyNewPassword = 'New password and verification do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async () => {
        if (validate()) {

            const passwordUpdate = {
                "old_password": "Admin@123",
                "new_password1": "Admin@1234",
                "new_password2": "Admin@1234"
            }
            try {
                const response = await adminPasswordReset(passwordUpdate)
                console.log(response)
            } catch (e) {
                console.error(e)
            }
            finally {
                setCurrentPassword('');
                setNewPassword('');
                setVerifyNewPassword('');
                setErrors({});
            }


        }

    };

    return (
        <div className="rounded-lg border border-[#e4e7ec] bg-white p-6">
            <h2 className="text-lg font-semibold text-[#101828] mb-4">Password management</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="current-password">Current password *</Label>
                    <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1"
                    />
                    {errors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="new-password">New password *</Label>
                    <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1"
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="verify-new-password">Verify new password *</Label>
                    <Input
                        id="verify-new-password"
                        type="password"
                        value={verifyNewPassword}
                        onChange={(e) => setVerifyNewPassword(e.target.value)}
                        className="mt-1"
                    />
                    {errors.verifyNewPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.verifyNewPassword}</p>
                    )}
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleChangePassword} className="bg-[#7F56D9] text-white hover:bg-[#6941C6]">
                        Change
                    </Button>
                </div>
            </div>
        </div>
    );
}
