import React, { useState } from 'react';
import './App.css';

const providerConfig = {
  pragmatic: {
    name: 'Pragmatic Play',
    transformUrl: (baseUrl, geo, currency) => {
      const lang = geo.split('-')[0];
      let newUrl = baseUrl.replace(/lang=\w+/gi, `lang=${lang}`);
      newUrl = newUrl.replace(/cur=\w+/gi, `cur=${currency}`);
      return newUrl;
    }
  },
  playngo: {
    name: 'Play\'n GO',
    transformUrl: (baseUrl, geo, currency) => {
      const langFormat = geo.replace('-', '_');
      const newUrl = baseUrl.replace(/lang=\w+_\w+/gi, `lang=${langFormat}`);
      return newUrl;
    }
  }
};

const currencies = {
  'en-GB': 'GBP',
  'nl-NL': 'EUR',
  'ro-RO': 'RON',
  'el-GR': 'EUR',
  'en-AU': 'AUD',
  'cs-CZ': 'CZK'
};

const availableGeo = [
  { code: 'en-GB', label: 'United Kingdom (en-GB)', currency: 'GBP' },
  { code: 'nl-NL', label: 'Netherlands (nl-NL)', currency: 'EUR' },
  { code: 'ro-RO', label: 'Romania (ro-RO)', currency: 'RON' },
  { code: 'el-GR', label: 'Greece (el-GR)', currency: 'EUR' },
  { code: 'en-AU', label: 'Australia (en-AU)', currency: 'AUD' },
  { code: 'cs-CZ', label: 'Czech Republic (cs-CS)', currency: 'CZK' }
];

const availableProviders = [
  { id: 'pragmatic', label: '🎮 Pragmatic Play' },
  { id: 'playngo', label: '🎰 Play\'n GO' }
];

function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('pragmatic');
  const [selectedGeo, setSelectedGeo] = useState('en-GB');
  const [outputUrl, setOutputUrl] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const copyToClipboard = async (text) => {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleTransform = async () => {
    if (!inputUrl.trim()) {
      showNotification('Пожалуйста, введите URL', 'error');
      return;
    }

    const provider = providerConfig[selectedProvider];
    if (!provider) {
      showNotification('Выбранный провайдер не найден', 'error');
      return;
    }

    const currency = currencies[selectedGeo];
    const transformedUrl = provider.transformUrl(inputUrl, selectedGeo, currency);
    setOutputUrl(transformedUrl);

    // Автоматическое копирование в буфер
    const copied = await copyToClipboard(transformedUrl);
    if (copied) {
      showNotification('URL преобразован и скопирован в буфер!', 'success');
    } else {
      showNotification('URL преобразован, но не удалось скопировать', 'error');
    }
  };

  const handleCopy = async () => {
    if (!outputUrl) {
      showNotification('Нет URL для копирования', 'error');
      return;
    }
    const copied = await copyToClipboard(outputUrl);
    if (copied) {
      showNotification('URL скопирован в буфер обмена!', 'success');
    } else {
      showNotification('Не удалось скопировать URL', 'error');
    }
  };

  return (
    <div className="container">
      {/* Уведомление */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="header">
        <h1 className="title">🎮 DEMO URL Transformer</h1>
      </div>

      <div className="card">
        <div className="form-group">
          <label className="label">🔗 Входной URL</label>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="input"
            placeholder="Вставьте URL игры..."
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label className="label">🎲 Провайдер</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="select"
            >
              {availableProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">🌍 Гео и валюта</label>
            <select
              value={selectedGeo}
              onChange={(e) => setSelectedGeo(e.target.value)}
              className="select"
            >
              {availableGeo.map(geo => (
                <option key={geo.code} value={geo.code}>
                  {geo.label} - {geo.currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleTransform} className="button">
          <span className="button-icon">🔄</span>
          Преобразовать и скопировать
        </button>

        {outputUrl && (
          <div className="result-container">
            <div className="result-header">
              <label className="result-label">✅ Результат</label>
              <button onClick={handleCopy} className="copy-button">
                📋 Копировать
              </button>
            </div>
            <div className="result-box">
              <code className="result-url">{outputUrl}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;