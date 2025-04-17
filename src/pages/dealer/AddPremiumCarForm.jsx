import { useState } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Grid,
  Typography,
} from '@mui/material';

const fuelTypeOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const transmissionOptions = ['Manual', 'Automatic'];

const initialFormState = {
  premiumCarId: 0,
  airbag: false,
  buttonStart: false,
  sunroof: false,
  childSafetyLocks: false,
  acFeature: false,
  musicFeature: false,
  area: '',
  brand: '',
  carInsurance: false,
  carStatus: 'PENDING',
  city: '',
  color: '',
  description: '',
  fuelType: '',
  kmDriven: 0,
  model: '',
  ownerSerial: 0,
  powerWindowFeature: false,
  price: 0,
  rearParkingCameraFeature: false,
  registration: '',
  safetyDescription: '',
  transmission: '',
  title: '',
  variant: '',
  carInsuranceDate: '',
  year: new Date().getFullYear(),
  dealer: {
    address: '',
    document: 0,
    area: '',
    city: '',
    firstName: '',
    lastName: '',
    mobileNo: '',
    shopName: '',
    email: '',
    password: '',
    dealer_id: 0,
    userId: 0,
    status: true,
    salesPersonId: 0,
    totalCarCount: 0,
    premiumCarCount: 0,
  },
  dealer_id: 0,
  date: new Date().toISOString().slice(0, 10),
  carInsuranceType: '',
  mainCarId: '',
  abs: false,
};

export default function AddPremiumCarForm() {
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('dealer.')) {
      const dealerField = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        dealer: { ...prev.dealer, [dealerField]: type === 'checkbox' ? checked : value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form:', form);
    // TODO: POST /premiumCar/register
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-5xl mx-auto">
      <Typography variant="h4" className="mb-6">
        Register Premium Car
      </Typography>
      <Grid container spacing={2}>
        {/* Car Details */}
        {[
          { name: 'title', label: 'Title' },
          { name: 'brand', label: 'Brand' },
          { name: 'model', label: 'Model' },
          { name: 'variant', label: 'Variant' },
          { name: 'registration', label: 'Registration No.' },
          { name: 'mainCarId', label: 'Main Car ID' },
          { name: 'price', label: 'Price', type: 'number' },
          { name: 'color', label: 'Color' },
          { name: 'description', label: 'Description' },
          { name: 'safetyDescription', label: 'Safety Description' },
          { name: 'area', label: 'Area' },
          { name: 'city', label: 'City' },
          { name: 'fuelType', label: 'Fuel Type', select: true, options: fuelTypeOptions },
          { name: 'transmission', label: 'Transmission', select: true, options: transmissionOptions },
          { name: 'kmDriven', label: 'KM Driven', type: 'number' },
          { name: 'ownerSerial', label: 'Owner Serial', type: 'number' },
          { name: 'year', label: 'Year', type: 'number' },
          { name: 'carInsuranceDate', label: 'Insurance Date', type: 'date' },
          { name: 'carInsuranceType', label: 'Insurance Type' },
        ].map(({ name, label, type = 'text', select, options }) => (
          <Grid item xs={12} sm={6} key={name}>
            <TextField
              fullWidth
              type={type}
              name={name}
              label={label}
              value={form[name]}
              onChange={handleChange}
              select={select}
              InputLabelProps={type === 'date' ? { shrink: true } : undefined}
            >
              {select &&
                options.map((option) => (
                  <MenuItem value={option} key={option}>
                    {option}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        ))}

        {/* Features Checkboxes */}
        {[
          'airbag',
          'abs',
          'acFeature',
          'musicFeature',
          'sunroof',
          'childSafetyLocks',
          'powerWindowFeature',
          'rearParkingCameraFeature',
          'buttonStart',
          'carInsurance',
        ].map((feature) => (
          <Grid item xs={12} sm={4} key={feature}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form[feature]}
                  name={feature}
                  onChange={handleChange}
                />
              }
              label={feature.replace(/([A-Z])/g, ' $1')}
            />
          </Grid>
        ))}

        {/* Dealer Fields */}
        <Grid item xs={12}>
          <Typography variant="h6" className="mt-4 mb-2">
            Dealer Info
          </Typography>
        </Grid>
        {[
          'firstName',
          'lastName',
          'mobileNo',
          'email',
          'password',
          'shopName',
          'address',
          'area',
          'city',
        ].map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              fullWidth
              name={`dealer.${field}`}
              label={field.replace(/([A-Z])/g, ' $1')}
              value={form.dealer[field]}
              onChange={handleChange}
            />
          </Grid>
        ))}
        {/* Dealer IDs */}
        {[
          'dealer_id',
          'userId',
          'salesPersonId',
          'document',
          'totalCarCount',
          'premiumCarCount',
        ].map((field) => (
          <Grid item xs={12} sm={4} key={field}>
            <TextField
              fullWidth
              name={`dealer.${field}`}
              label={field.replace(/([A-Z])/g, ' $1')}
              type="number"
              value={form.dealer[field]}
              onChange={handleChange}
            />
          </Grid>
        ))}
        {/* Dealer status */}
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.dealer.status}
                name="dealer.status"
                onChange={handleChange}
              />
            }
            label="Dealer Active"
          />
        </Grid>

        {/* Submit */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Submit Car
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
