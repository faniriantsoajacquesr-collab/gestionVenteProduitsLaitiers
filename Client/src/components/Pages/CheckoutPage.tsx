import React, { useState } from 'react';

export default function CheckoutPage() {
  const [email, setEmail] = useState('faniriantsoajacquesr@gmail.com');
  const [shippingOption, setShippingOption] = useState('address'); // 'address' or 'accessPoint'
  const [deliveryOption, setDeliveryOption] = useState('standard'); // 'standard', 'expedited', 'rush'
  const [giftMessage, setGiftMessage] = useState(false);

  // Placeholder states for address fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to proceed to payment
    console.log('Proceeding to payment with:', {
      email,
      shippingOption,
      deliveryOption,
      giftMessage,
      // ... other form data
    });
    alert('Proceeding to Payment!');
  };

  return (
    <div className="container mx-auto p-6 pt-32 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-on-surface">Checkout</h1>

      {/* Welcome Message */}
      <div className="bg-surface-container-low p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-semibold text-on-surface">Welcome, FANIRIANTSOA!</h2>
        <p className="text-on-surface-variant mt-2">You are logged in.</p>
      </div>

      {/* Email Section */}
      <div className="bg-surface-container-low p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-on-surface mb-4">Enter your email address</h2>
        <label htmlFor="email" className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
        <input
          type="email"
          id="email"
          className="w-full p-3 border border-outline rounded-md bg-surface-container placeholder-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
        />
        <p className="text-xs text-on-surface-variant mt-2">We will send order confirmation to this address.</p>
      </div>

      {/* Shipping & Delivery Section */}
      <div className="bg-surface-container-low p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-on-surface mb-4">1. Shipping & Delivery</h2>

        {/* Shipping Address Options */}
        <div className="space-y-4 mb-6">
          <div>
            <input
              type="radio"
              id="shipToAddress"
              name="shippingOption"
              value="address"
              checked={shippingOption === 'address'}
              onChange={() => setShippingOption('address')}
              className="mr-2 accent-primary"
            />
            <label htmlFor="shipToAddress" className="font-medium text-on-surface">Ship To Address</label>
            <p className="text-sm text-on-surface-variant ml-5">Have your items shipped to a preferred address.</p>
          </div>
          <div>
            <input
              type="radio"
              id="shipToAccessPoint"
              name="shippingOption"
              value="accessPoint"
              checked={shippingOption === 'accessPoint'}
              onChange={() => setShippingOption('accessPoint')}
              className="mr-2 accent-primary"
            />
            <label htmlFor="shipToAccessPoint" className="font-medium text-on-surface">Ship To Access Point</label>
            <p className="text-sm text-on-surface-variant ml-5">Have your items shipped to any UPS Access Point.</p>
          </div>
        </div>

        {/* Address Input Fields */}
        {shippingOption === 'address' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input type="text" placeholder="First Name" className="p-3 border border-outline rounded-md bg-surface-container" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" className="p-3 border border-outline rounded-md bg-surface-container" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input type="text" placeholder="Address 1" className="md:col-span-2 p-3 border border-outline rounded-md bg-surface-container" value={address1} onChange={(e) => setAddress1(e.target.value)} />
            <input type="text" placeholder="Address 2 (optional)" className="md:col-span-2 p-3 border border-outline rounded-md bg-surface-container" value={address2} onChange={(e) => setAddress2(e.target.value)} />
            <input type="text" placeholder="City" className="p-3 border border-outline rounded-md bg-surface-container" value={city} onChange={(e) => setCity(e.target.value)} />
            <select className="p-3 border border-outline rounded-md bg-surface-container text-on-surface-variant" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select State...</option>
              <option value="NY">New York</option>
              <option value="CA">California</option>
              {/* Add more states */}
            </select>
            <input type="text" placeholder="ZIP Code" className="p-3 border border-outline rounded-md bg-surface-container" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            <input type="tel" placeholder="Phone Number (e.g., (555) 555-5555)" className="p-3 border border-outline rounded-md bg-surface-container" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <div className="md:col-span-2 flex items-center">
              <input type="checkbox" id="saveAddress" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="mr-2 accent-primary" />
              <label htmlFor="saveAddress" className="text-sm text-on-surface-variant">Save this address to my account</label>
            </div>
          </div>
        )}

        {/* Delivery Options */}
        <h3 className="text-lg font-semibold text-on-surface mb-3">Select Delivery Option</h3>
        <p className="text-sm text-on-surface-variant mb-4">Note: Items in your order may ship separately.</p>
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="radio" id="standardDelivery" name="deliveryOption" value="standard" checked={deliveryOption === 'standard'} onChange={() => setDeliveryOption('standard')} className="mr-2 accent-primary" />
            <label htmlFor="standardDelivery" className="flex-1 text-on-surface">Standard Delivery <span className="text-on-surface-variant text-sm">(Est. arrival Apr 02-Apr 06)</span></label>
            <span className="font-bold text-primary">FREE</span>
          </div>
          <div className="flex items-center">
            <input type="radio" id="expeditedDelivery" name="deliveryOption" value="expedited" checked={deliveryOption === 'expedited'} onChange={() => setDeliveryOption('expedited')} className="mr-2 accent-primary" />
            <label htmlFor="expeditedDelivery" className="flex-1 text-on-surface">Expedited Delivery <span className="text-on-surface-variant text-sm">(Est. arrival Mar 31-Apr 01)</span></label>
            <span className="font-bold text-primary">$20.00</span>
          </div>
          <div className="flex items-center">
            <input type="radio" id="rushDelivery" name="deliveryOption" value="rush" checked={deliveryOption === 'rush'} onChange={() => setDeliveryOption('rush')} className="mr-2 accent-primary" />
            <label htmlFor="rushDelivery" className="flex-1 text-on-surface">Rush Delivery <span className="text-on-surface-variant text-sm">(Est. arrival Mar 30-Mar 31)</span></label>
            <span className="font-bold text-primary">$32.00</span>
          </div>
        </div>

        <div className="flex items-center mt-6">
          <input type="checkbox" id="giftMessage" checked={giftMessage} onChange={(e) => setGiftMessage(e.target.checked)} className="mr-2 accent-primary" />
          <label htmlFor="giftMessage" className="text-sm text-on-surface-variant">Add a gift message to my order</label>
        </div>
      </div>

      {/* Continue to Payment Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full creamy-gradient text-on-primary font-bold py-4 rounded-full hover:scale-[1.02] hover:shadow-lg transition-all active:scale-95"
      >
        Continue to Payment
      </button>
    </div>
  );
}