import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { addressService } from '../../services/address.service';
import { Check, ShieldCheck, Undo2, Truck, Lock, Home } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartItems, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [loading, setLoading] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getUserAddresses();
        if (response.success && response.data?.length > 0) {
          setSavedAddresses(response.data);

          // Select default if exists, else first one
          const defaultAddr = response.data.find(a => a.isDefault) || response.data[0];
          selectAddress(defaultAddr);
        }
      } catch (error) {
        console.error("Could not fetch addresses", error);
      }
    };
    fetchAddresses();
  }, []);

  const selectAddress = (addr) => {
    setSelectedAddressId(addr._id);

    const nameParts = (addr.fullName || '').split(' ');
    const first = nameParts[0] || '';
    const last = nameParts.slice(1).join(' ') || '';

    setFormData(prev => ({
      ...prev,
      firstName: first || prev.firstName,
      lastName: last || prev.lastName,
      phone: addr.phoneNumber || prev.phone,
      address: addr.streetAddress || prev.address,
      city: addr.city || prev.city,
      state: addr.state || prev.state,
      zip: addr.postalCode || prev.zip,
      country: addr.country || prev.country
    }));
  };

  const handleSaveAddress = async () => {
    if (!formData.firstName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.country) {
      toast.error('Please fill in all address and contact fields before saving.');
      return;
    }

    setSavingAddress(true);
    try {
      const newAddressData = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phone,
        streetAddress: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.zip,
        country: formData.country,
        isDefault: savedAddresses.length === 0
      };

      const response = await addressService.createAddress(newAddressData);
      if (response.success && response.data) {
        toast.success('Address saved successfully!');
        setSavedAddresses(prev => [...prev, response.data]);
        setSelectedAddressId(response.data._id);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const orderItems = cartItems.map(item => ({
        product: item.id || item._id,
        name: item.name,
        qty: item.quantity,
        image: item.image || (item.images && item.images[0]?.url) || '',
        price: item.price
      }));

      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        postalCode: formData.zip,
        country: formData.country,
      };

      const { data: orderData } = await api.post('/payment/create-order', {
        orderItems,
        shippingAddress
      });

      if (!orderData.success) {
        toast.error(orderData.message || "Failed to initialize payment");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: " ", 
        description: "Excellence in every detail",
        image: window.location.origin + "/imagesss/logo.png",
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const { data: verifyData } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: orderData.dbOrderId
            });

            if (verifyData.success) {
              toast.success("Payment Successful!");
              clearCart();
              navigate(`/order-success/${verifyData.dbOrderId}`);
            } else {
              toast.error(verifyData.message || "Payment verification failed");
              setLoading(false);
            }
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#031637",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong during checkout. Please try again.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
      <div className="container">

        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
              <Check size={16} />
            </div>
            <span style={{ margin: '0 1rem', fontSize: '0.9rem', color: 'var(--color-navy)', fontWeight: '500' }}>Cart</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-gold)' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-gold)', opacity: 0.5 }}></div>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 1rem' }}>
              2
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-navy)', fontWeight: 'bold' }}>Checkout</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0', marginLeft: '1rem' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0', margin: '0 1rem' }}>
              3
            </div>
            <span style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>Payment</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0', marginLeft: '1rem' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0', marginRight: '1rem' }}>
              4
            </div>
            <span style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>Order Placed</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Checkout</h1>
          <p style={{ color: 'var(--color-gray-dark)' }}>Please fill in your details to place the order</p>
        </div>

        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '3rem' }}>

          {/* Left Side: Forms */}
          <div className="checkout-form-container">
            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              {/* Contact Information Card */}
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(217, 164, 65, 0.2)', borderRadius: '8px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)' }}>Contact Information</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="input-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="checkout-input" />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="checkout-input" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="checkout-input" />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="checkout-input" />
                  </div>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(217, 164, 65, 0.2)', borderRadius: '8px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)' }}>Delivery Address</h3>

                {savedAddresses.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {savedAddresses.map((addr, idx) => (
                      <label
                        key={addr._id}
                        onClick={() => selectAddress(addr)}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          padding: '1.25rem',
                          border: selectedAddressId === addr._id ? '1px solid var(--color-gold)' : '1px solid #e0e0e0',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedAddressId === addr._id ? '#faf9f6' : '#fff',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr._id}
                          readOnly
                          style={{ accentColor: 'var(--color-gold)', marginTop: '0.25rem', width: '18px', height: '18px' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <div style={{ backgroundColor: '#f5f5f5', padding: '0.4rem', borderRadius: '4px' }}>
                              <Home size={18} color="var(--color-navy)" />
                            </div>
                            <span style={{ fontWeight: '600', color: 'var(--color-navy)' }}>Address {idx + 1}</span>
                            {addr.isDefault && (
                              <span style={{ backgroundColor: 'rgba(217, 164, 65, 0.2)', color: 'var(--color-gold)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '12px', fontWeight: '600' }}>Default</span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.9rem', color: 'var(--color-navy)' }}>{addr.fullName}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>{addr.streetAddress}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>{addr.city}, {addr.state} - {addr.postalCode}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>{addr.country}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-navy)', marginTop: '0.25rem' }}>Phone: {addr.phoneNumber}</span>
                        </div>
                      </label>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddressId('new');
                        setFormData(prev => ({
                          ...prev,
                          address: '', city: '', state: '', zip: '', country: 'India'
                        }));
                      }}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'transparent',
                        border: '1px dashed var(--color-gold)',
                        borderRadius: '8px',
                        color: 'var(--color-gold)',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                      }}
                    >
                      + Add New Address
                    </button>
                  </div>
                )}

                {selectedAddressId === 'new' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="input-group">
                      <label>Street Address / Apartment</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} required className="checkout-input" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="input-group">
                        <label>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required className="checkout-input" />
                      </div>
                      <div className="input-group">
                        <label>State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} required className="checkout-input" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="input-group">
                        <label>Zip / Postal Code</label>
                        <input type="text" name="zip" value={formData.zip} onChange={handleChange} required className="checkout-input" />
                      </div>
                      <div className="input-group">
                        <label>Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} required className="checkout-input" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      disabled={savingAddress}
                      style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: 'var(--color-navy)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: '500',
                        cursor: savingAddress ? 'not-allowed' : 'pointer',
                        opacity: savingAddress ? 0.7 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {savingAddress ? 'Saving...' : 'Save this Address'}
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method Card */}
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(217, 164, 65, 0.2)', borderRadius: '8px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)' }}>Payment Method</h3>

                <div style={{ padding: '1.5rem', border: '1px solid rgba(217, 164, 65, 0.4)', borderRadius: '6px', backgroundColor: '#faf9f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--color-navy)', fontWeight: '500' }}>
                      <input type="radio" name="payment" value="razorpay" defaultChecked style={{ accentColor: 'var(--color-gold)', width: '18px', height: '18px' }} />
                      Razorpay
                    </label>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" style={{ height: '22px' }} />
                  </div>
                  <p style={{ margin: '0.5rem 0 0 2rem', fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>
                    You will be redirected to Razorpay to complete the payment securely.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', color: 'var(--color-gray-dark)', fontSize: '0.85rem' }}>
                  <ShieldCheck size={16} />
                  <span>Your payment information is secured by Razorpay.</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', letterSpacing: '1px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'PROCESSING...' : `PROCEED TO PAYMENT`}
              </button>
            </form>
          </div>

          {/* Right Side: Order Summary */}
          <div className="checkout-summary-container">
            <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid rgba(217, 164, 65, 0.2)', borderRadius: '8px', position: 'sticky', top: '120px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)', margin: 0 }}>Order Summary</h2>
                <Link to="/cart" style={{ color: 'var(--color-gold)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '500' }}>Edit Cart</Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '0.5rem', borderRadius: '6px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', mixBlendMode: 'multiply' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--color-navy)', margin: '0 0 0.25rem 0', fontWeight: '600' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-dark)', margin: 0 }}>
                        ₹{item.price.toFixed(2)} &nbsp;&times;&nbsp; {item.quantity}
                      </p>
                    </div>
                    <div style={{ fontWeight: '600', color: 'var(--color-navy)', fontSize: '0.95rem' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-gray-dark)', fontSize: '0.95rem' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--color-navy)', fontWeight: '500' }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--color-gray-dark)', fontSize: '0.95rem' }}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--color-navy)', fontWeight: '500' }}>₹0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-navy)', display: 'block' }}>Total Payable</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-dark)' }}>(Inclusive of all taxes)</span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-navy)' }}>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-gray-dark)', fontSize: '0.85rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(217, 164, 65, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <span>100% Authentic Jewellery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-gray-dark)', fontSize: '0.85rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(217, 164, 65, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                    <Undo2 size={18} />
                  </div>
                  <span>Easy 7 Day Returns</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-gray-dark)', fontSize: '0.85rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(217, 164, 65, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                    <Truck size={18} />
                  </div>
                  <span>Free Insured Shipping</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-gray-dark)', fontSize: '0.85rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(217, 164, 65, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                    <Lock size={18} />
                  </div>
                  <span>Secure Payments</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-group label {
          font-size: 0.85rem;
          color: var(--color-gray-dark);
          margin-left: 0.25rem;
        }
        .checkout-input {
          width: 100%;
          padding: 0.9rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          outline: none;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          transition: all 0.3s;
          background-color: #fdfdfd;
        }
        .checkout-input:focus {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 3px rgba(217, 164, 65, 0.1);
        }
        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .checkout-summary-container {
            order: -1; 
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
