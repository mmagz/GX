import React, { useState } from 'react';
import { useAddress } from './AddressContext';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useAuthContext } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { isValidEmail, isValidIndianPhone, isValidPincode } from '../utils/performance';

interface AddressSelectorProps {
  selectedAddress: any;
  onAddressSelect: (address: any) => void;
  onAddressChange: (address: any) => void;
}

export function AddressSelector({ selectedAddress, onAddressSelect, onAddressChange }: AddressSelectorProps) {
  const { addresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();
  const { isSignedIn } = useAuth();
  const { login } = useAuthContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });
  
  const [newAddressErrors, setNewAddressErrors] = useState({});
  const [editingAddressErrors, setEditingAddressErrors] = useState({});

  const validateAddressForm = (address: any, isEdit = false) => {
    const errors: Record<string, string> = {};
    
    if (!address.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!address.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!address.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(address.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!address.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidIndianPhone(address.phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    
    if (!address.address?.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!address.city?.trim()) {
      errors.city = 'City is required';
    }
    
    if (!address.state?.trim()) {
      errors.state = 'State is required';
    }
    
    if (!address.pincode?.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!isValidPincode(address.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    if (isEdit) {
      setEditingAddressErrors(errors);
    } else {
      setNewAddressErrors(errors);
    }
    
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = async () => {
    if (!validateAddressForm(newAddress, false)) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    const success = await addAddress(newAddress);
    if (success) {
      setIsAddDialogOpen(false);
      setNewAddress({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false
      });
      setNewAddressErrors({});
    }
  };

  const handleEditAddress = async () => {
    if (!editingAddress) return;

    if (!validateAddressForm(editingAddress, true)) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    const success = await updateAddress(editingAddress._id, editingAddress);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingAddress(null);
      setEditingAddressErrors({});
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    toast.error('Delete Address', {
      description: 'Are you sure you want to delete this address?',
      action: {
        label: 'Delete',
        onClick: async () => {
          await deleteAddress(addressId);
          if (selectedAddress?._id === addressId) {
            onAddressSelect(null);
          }
        }
      }
    });
  };

  const handleSetDefault = async (addressId: string) => {
    await setDefaultAddress(addressId);
  };

  const openEditDialog = (address: any) => {
    setEditingAddress({ ...address });
    setEditingAddressErrors({});
    setIsEditDialogOpen(true);
  };

  const handleNewAddressChange = (field: string, value: string | boolean) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (newAddressErrors[field]) {
      setNewAddressErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEditingAddressChange = (field: string, value: string | boolean) => {
    setEditingAddress(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (editingAddressErrors[field]) {
      setEditingAddressErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isSignedIn) {
    return (
      <div className="frosted-glass border border-white/30 rounded-sm p-6 text-center">
        <MapPin size={48} className="mx-auto mb-4 text-[#262930]/50" />
        <h3 className="uppercase-headline mb-4 text-[#262930]" style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}>
          SHIPPING ADDRESS
        </h3>
        <p className="mb-4 opacity-70 text-[#262930]" style={{ fontSize: '13px' }}>
          Please sign in to manage your addresses
        </p>
        <Button
          onClick={() => login()}
          className="bg-[#D04007] hover:bg-[#ff6b1a] text-white uppercase-headline"
          style={{ fontSize: '11px', letterSpacing: '0.1em' }}
        >
          SIGN IN
        </Button>
      </div>
    );
  }

  return (
    <div className="frosted-glass border border-white/30 rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="uppercase-headline" style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}>
          SHIPPING ADDRESS
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-[#262930]/20 text-[#262930] hover:bg-[#262930]/10 hover:border-[#D04007] hover:text-[#262930]"
            >
              <Plus size={16} className="mr-2" />
              ADD NEW
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={newAddress.firstName}
                    onChange={(e) => handleNewAddressChange('firstName', e.target.value)}
                    className={newAddressErrors.firstName ? 'border-red-500' : ''}
                  />
                  {newAddressErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{newAddressErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={newAddress.lastName}
                    onChange={(e) => handleNewAddressChange('lastName', e.target.value)}
                    className={newAddressErrors.lastName ? 'border-red-500' : ''}
                  />
                  {newAddressErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{newAddressErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAddress.email}
                  onChange={(e) => handleNewAddressChange('email', e.target.value)}
                  className={newAddressErrors.email ? 'border-red-500' : ''}
                />
                {newAddressErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{newAddressErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => handleNewAddressChange('phone', e.target.value)}
                  className={newAddressErrors.phone ? 'border-red-500' : ''}
                />
                {newAddressErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{newAddressErrors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={newAddress.address}
                  onChange={(e) => handleNewAddressChange('address', e.target.value)}
                  className={newAddressErrors.address ? 'border-red-500' : ''}
                />
                {newAddressErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{newAddressErrors.address}</p>
                )}
              </div>
              <div>
                <Label htmlFor="apartment">Apartment, Suite, etc.</Label>
                <Input
                  id="apartment"
                  value={newAddress.apartment}
                  onChange={(e) => handleNewAddressChange('apartment', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => handleNewAddressChange('city', e.target.value)}
                    className={newAddressErrors.city ? 'border-red-500' : ''}
                  />
                  {newAddressErrors.city && (
                    <p className="text-red-500 text-xs mt-1">{newAddressErrors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) => handleNewAddressChange('state', e.target.value)}
                    className={newAddressErrors.state ? 'border-red-500' : ''}
                  />
                  {newAddressErrors.state && (
                    <p className="text-red-500 text-xs mt-1">{newAddressErrors.state}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={newAddress.pincode}
                  onChange={(e) => handleNewAddressChange('pincode', e.target.value)}
                  className={newAddressErrors.pincode ? 'border-red-500' : ''}
                />
                {newAddressErrors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{newAddressErrors.pincode}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => handleNewAddressChange('isDefault', e.target.checked)}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddAddress}
                  className="flex-1 bg-[#D04007] hover:bg-[#ff6b1a]"
                >
                  ADD ADDRESS
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#262930]" style={{ fontSize: '16px' }}>Loading...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin size={48} className="mx-auto mb-4 text-[#262930]/50" />
          <p className="opacity-70 text-[#262930]" style={{ fontSize: '13px' }}>
            No addresses saved yet
          </p>
        </div>
      ) : (
        <RadioGroup value={selectedAddress?._id || ''} onValueChange={(value) => {
          const address = addresses.find(addr => addr._id === value);
          onAddressSelect(address || null);
          onAddressChange(address || null);
        }}>
          <div className="space-y-3">
            {addresses.map((address) => (
              <div key={address._id} className="relative">
                <div className="flex items-start space-x-3 p-4 border border-white/30 rounded-sm hover:border-[#D04007] transition-colors cursor-pointer">
                  <RadioGroupItem value={address._id} id={address._id} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <label htmlFor={address._id} className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium" style={{ fontSize: '13px' }}>
                            {address.firstName} {address.lastName}
                          </span>
                          {address.isDefault && (
                            <span className="bg-[#D04007] text-white px-2 py-0.5 rounded text-xs uppercase">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div className="opacity-70" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                          {address.address}{address.apartment && `, ${address.apartment}`}<br />
                          {address.city}, {address.state} - {address.pincode}<br />
                          {address.phone}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="px-2 py-1 text-xs text-[#262930]/70 hover:text-green-600 hover:bg-green-50 transition-colors border border-[#262930]/20 hover:border-green-600 rounded"
                      title="Set as default"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => openEditDialog(address)}
                    className="p-1 text-[#262930]/60 hover:text-[#D04007] transition-colors"
                    title="Edit address"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="p-1 text-[#262930]/60 hover:text-red-600 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name *</Label>
                  <Input
                    id="editFirstName"
                    value={editingAddress.firstName}
                    onChange={(e) => handleEditingAddressChange('firstName', e.target.value)}
                    className={editingAddressErrors.firstName ? 'border-red-500' : ''}
                  />
                  {editingAddressErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{editingAddressErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name *</Label>
                  <Input
                    id="editLastName"
                    value={editingAddress.lastName}
                    onChange={(e) => handleEditingAddressChange('lastName', e.target.value)}
                    className={editingAddressErrors.lastName ? 'border-red-500' : ''}
                  />
                  {editingAddressErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{editingAddressErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="editEmail">Email *</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingAddress.email}
                  onChange={(e) => handleEditingAddressChange('email', e.target.value)}
                  className={editingAddressErrors.email ? 'border-red-500' : ''}
                />
                {editingAddressErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{editingAddressErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="editPhone">Phone *</Label>
                <Input
                  id="editPhone"
                  type="tel"
                  value={editingAddress.phone}
                  onChange={(e) => handleEditingAddressChange('phone', e.target.value)}
                  className={editingAddressErrors.phone ? 'border-red-500' : ''}
                />
                {editingAddressErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{editingAddressErrors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="editAddress">Address *</Label>
                <Input
                  id="editAddress"
                  value={editingAddress.address}
                  onChange={(e) => handleEditingAddressChange('address', e.target.value)}
                  className={editingAddressErrors.address ? 'border-red-500' : ''}
                />
                {editingAddressErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{editingAddressErrors.address}</p>
                )}
              </div>
              <div>
                <Label htmlFor="editApartment">Apartment, Suite, etc.</Label>
                <Input
                  id="editApartment"
                  value={editingAddress.apartment || ''}
                  onChange={(e) => handleEditingAddressChange('apartment', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCity">City *</Label>
                  <Input
                    id="editCity"
                    value={editingAddress.city}
                    onChange={(e) => handleEditingAddressChange('city', e.target.value)}
                    className={editingAddressErrors.city ? 'border-red-500' : ''}
                  />
                  {editingAddressErrors.city && (
                    <p className="text-red-500 text-xs mt-1">{editingAddressErrors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="editState">State *</Label>
                  <Input
                    id="editState"
                    value={editingAddress.state}
                    onChange={(e) => handleEditingAddressChange('state', e.target.value)}
                    className={editingAddressErrors.state ? 'border-red-500' : ''}
                  />
                  {editingAddressErrors.state && (
                    <p className="text-red-500 text-xs mt-1">{editingAddressErrors.state}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="editPincode">Pincode *</Label>
                <Input
                  id="editPincode"
                  value={editingAddress.pincode}
                  onChange={(e) => handleEditingAddressChange('pincode', e.target.value)}
                  className={editingAddressErrors.pincode ? 'border-red-500' : ''}
                />
                {editingAddressErrors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{editingAddressErrors.pincode}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsDefault"
                  checked={editingAddress.isDefault}
                  onChange={(e) => handleEditingAddressChange('isDefault', e.target.checked)}
                />
                <Label htmlFor="editIsDefault">Set as default address</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleEditAddress}
                  className="flex-1 bg-[#D04007] hover:bg-[#ff6b1a]"
                >
                  UPDATE ADDRESS
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
