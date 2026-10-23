import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

const POPULAR_CITIES = [
  { label: '🇮🇳 New Delhi', val: 'New Delhi, India' },
  { label: '🇮🇳 Mumbai', val: 'Mumbai, India' },
  { label: '🇮🇳 Bengaluru', val: 'Bengaluru, India' },
  { label: '🇮🇳 Varanasi', val: 'Varanasi, India' },
  { label: '🇮🇳 Ayodhya', val: 'Ayodhya, India' },
  { label: '🇮🇳 Kolkata', val: 'Kolkata, India' },
  { label: '🇮🇳 Hyderabad', val: 'Hyderabad, India' },
  { label: '🇮🇳 Pune', val: 'Pune, India' },
  { label: '🇦🇪 Dubai', val: 'Dubai, UAE' },
  { label: '🇬🇧 London', val: 'London, UK' },
  { label: '🇺🇸 New York', val: 'New York, USA' },
  { label: '🇨🇦 Toronto', val: 'Toronto, Canada' },
];

export default function BirthDetailsForm({
  form,
  setForm,
  onSubmit,
  isCalculating,
  step,
  lang,
  err,
  setErr,
  onFillSample,
  isLocating,
  onDetectLocation,
}) {
  const isHi = lang === 'hi';
  const [timeUnsure, setTimeUnsure] = useState(false);

  const handleTimeUnsureToggle = (checked) => {
    setTimeUnsure(checked);
    if (checked) {
      setForm(prev => ({ ...prev, tob: '12:00' }));
    }
  };

  const handleCityClick = (cityVal) => {
    setForm(prev => ({ ...prev, pob: cityVal }));
    if (err) setErr('');
  };

  return (
    <Card
      variant="default"
      padding="lg"
      style={{
        maxWidth: 'var(--width-form)',
        margin: '0 auto var(--space-8) auto',
        boxShadow: 'var(--shadow-md)',
      }}
      className="birth-form-card"
    >
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <h2
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 800,
            color: 'var(--brand)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {isHi ? 'जन्म विवरण दर्ज करें' : 'Enter Your Birth Details'}
        </h2>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-secondary)',
            margin: 0,
          }}
        >
          {isHi
            ? 'ऋषि पाराशर विरचित शास्त्रीय सिद्धांतों के अनुसार सटीक ग्रह स्थिति एवं लग्न गणना'
            : 'Authentic planetary coordinates and Lagna computed according to Parashari principles'}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        noValidate
      >
        {/* Name Field */}
        <FormField
          id="birth-name"
          label={isHi ? 'पूरा नाम' : 'Full Name'}
          required
          helperText={isHi ? 'कुंडली पर अंकित करने हेतु' : 'Used for addressing your personalized horoscope'}
          error={err && !form.name.trim() ? (isHi ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name') : undefined}
        >
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              setForm(prev => ({ ...prev, name: e.target.value }));
              if (err) setErr('');
            }}
            placeholder={isHi ? 'उदा. अमित शर्मा' : 'e.g. Amit Sharma'}
            autoComplete="name"
          />
        </FormField>

        {/* Date and Time Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {/* DOB */}
          <FormField
            id="birth-dob"
            label={isHi ? 'जन्म तिथि' : 'Date of Birth'}
            required
            error={err && !form.dob ? (isHi ? 'जन्म तिथि आवश्यक है' : 'Date of birth is required') : undefined}
          >
            <input
              type="date"
              value={form.dob}
              onChange={(e) => {
                setForm(prev => ({ ...prev, dob: e.target.value }));
                if (err) setErr('');
              }}
            />
          </FormField>

          {/* TOB */}
          <FormField
            id="birth-tob"
            label={isHi ? 'जन्म समय' : 'Time of Birth'}
            helperText={
              timeUnsure
                ? (isHi ? 'अज्ञात समय के लिए दोपहर १२:०० (सूर्य मध्याह्न) निर्धारित' : 'Defaulting to solar noon (12:00 PM) for unknown time')
                : (isHi ? 'सटीक लग्न हेतु वास्तविक समय भरें' : 'Exact time determines your rising sign (Lagna)')
            }
          >
            <div>
              <input
                type="time"
                value={form.tob}
                disabled={timeUnsure}
                onChange={(e) => setForm(prev => ({ ...prev, tob: e.target.value }))}
                style={{ opacity: timeUnsure ? 0.6 : 1 }}
              />
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: 'var(--space-2)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ink-secondary)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={timeUnsure}
                  onChange={(e) => handleTimeUnsureToggle(e.target.checked)}
                  style={{ width: 'auto', margin: 0 }}
                />
                <span>{isHi ? 'जन्म समय ठीक से ज्ञात नहीं है (12:00 PM उपयोग करें)' : "I don't know the exact time (Use 12:00 PM)"}</span>
              </label>
            </div>
          </FormField>
        </div>

        {/* Place of Birth */}
        <FormField
          id="birth-pob"
          label={isHi ? 'जन्म स्थान (शहर / देश)' : 'Birth Place (City, State / Country)'}
          required
          helperText={isHi ? 'अक्षांश एवं देशांतर रेखाओं की सूक्ष्म गणना हेतु' : 'Determines exact geographic coordinates for planetary ascendant'}
          error={err && !form.pob.trim() ? (isHi ? 'कृपया जन्म स्थान दर्ज करें' : 'Please enter your birth city') : undefined}
        >
          <div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={form.pob}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, pob: e.target.value }));
                  if (err) setErr('');
                }}
                placeholder={isHi ? 'उदा. नई दिल्ली, मुंबई, लखनऊ...' : 'e.g. New Delhi, Mumbai, London...'}
                autoComplete="address-level2"
              />
              <button
                type="button"
                onClick={onDetectLocation}
                disabled={isLocating}
                style={{
                  position: 'absolute',
                  right: '6px',
                  background: 'var(--surface-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  cursor: isLocating ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title={isHi ? 'वर्तमान जीपीएस स्थान खोजें' : 'Use Current Location'}
              >
                <span>📍</span>
                <span>{isLocating ? (isHi ? 'खोज रहे...' : 'Locating...') : (isHi ? 'मेरा स्थान' : 'Use GPS')}</span>
              </button>
            </div>

            {/* Quick city suggestions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap',
                marginTop: 'var(--space-2)',
              }}
            >
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', fontWeight: 600 }}>
                {isHi ? 'त्वरित चयन:' : 'Popular:'}
              </span>
              {POPULAR_CITIES.slice(0, 7).map((city) => (
                <button
                  key={city.val}
                  type="button"
                  onClick={() => handleCityClick(city.val)}
                  style={{
                    background: form.pob === city.val ? 'var(--accent-light)' : 'var(--surface)',
                    border: form.pob === city.val ? '1px solid var(--border-focus)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 8px',
                    fontSize: 'var(--text-xs)',
                    color: form.pob === city.val ? 'var(--accent)' : 'var(--ink-secondary)',
                    fontWeight: form.pob === city.val ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>
        </FormField>

        {/* Gender Selection */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--ink)',
              marginBottom: 'var(--space-2)',
            }}
          >
            {isHi ? 'लिंग' : 'Gender'}
          </label>
          <div
            role="radiogroup"
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
            }}
          >
            {[
              { val: 'male', label: isHi ? 'पुरुष' : 'Male', icon: '♂' },
              { val: 'female', label: isHi ? 'महिला' : 'Female', icon: '♀' },
              { val: 'other', label: isHi ? 'अन्य' : 'Other', icon: '⚧' },
            ].map((g) => {
              const active = (form.gender || 'male') === g.val;
              return (
                <button
                  key={g.val}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setForm(prev => ({ ...prev, gender: g.val }))}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-sm)',
                    border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                    backgroundColor: active ? 'var(--accent-light)' : 'var(--surface)',
                    color: active ? 'var(--accent)' : 'var(--ink)',
                    fontWeight: active ? 700 : 500,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                  }}
                >
                  <span aria-hidden="true">{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Error Banner */}
        {err && (
          <div
            role="alert"
            style={{
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              color: 'var(--danger)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span aria-hidden="true">⚠️</span>
            <span>{err}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isCalculating}
          icon="✦"
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 700,
            marginBottom: 'var(--space-4)',
          }}
        >
          {isCalculating
            ? (isHi ? 'कुंडली गणना जारी है...' : 'Calculating Kundli...')
            : (isHi ? 'जन्म कुंडली तैयार करें ✦' : 'Create My Kundli ✦')}
        </Button>

        {/* Secondary Sample Action */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <button
            type="button"
            onClick={onFillSample}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-secondary)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚡</span>
            <span>{isHi ? 'नमूना डेटा से तुरंत देखें (Try Demo Details)' : 'Try an Example Chart (1-Click Demo)'}</span>
          </button>
        </div>

        {/* Calculation Note */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-muted)',
            lineHeight: 'var(--leading-snug)',
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--space-4)',
          }}
        >
          🔒 {isHi
            ? '१००% निजी गणना · आपका डेटा सर्वर पर सुरक्षित नहीं किया जाता · चित्रा पक्ष (लाहिड़ी) अयनांश'
            : '100% Private Client-Side Calculation · Zero tracking · High-precision Lahiri (Chitra Paksha) Ayanamsha'}
        </div>
      </form>
    </Card>
  );
}
