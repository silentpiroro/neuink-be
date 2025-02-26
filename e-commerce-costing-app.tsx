import React, { useState } from 'react';

const SockBusinessApp = () => {
  // Default data for B2B model
  const defaultB2B = {
    minOrder: 180,
    materials: 3.2,
    labor: 1.1,
    overhead: 0.8,
    packaging: 0.3,
    shipping: 1.8,
    markup: 30
  };

  // Default data for B2B2C model
  const defaultB2B2C = {
    packages: [
      { name: 'Small', quantity: 20, printingCost: 1.2, embroideryAdditional: 0.5, wovenLabelAdditional: 0.3, baseSockCost: 2.5, markup: 40, shippingCost: 13 },
      { name: 'Medium', quantity: 60, printingCost: 1.0, embroideryAdditional: 0.4, wovenLabelAdditional: 0.25, baseSockCost: 2.3, markup: 35, shippingCost: 32 },
      { name: 'Large', quantity: 120, printingCost: 0.8, embroideryAdditional: 0.3, wovenLabelAdditional: 0.2, baseSockCost: 2.1, markup: 30, shippingCost: 63 }
    ],
    selectedDecorationMethod: 'Printing'
  };

  // Default data for B2C model
  const defaultB2C = {
    packages: [
      { name: 'Diabetic 3-Pack', pairs: 3, costPerPair: 2.8, packaging: 0.7, markup: 65, shippingCost: 6 },
      { name: 'Diabetic 6-Pack', pairs: 6, costPerPair: 2.7, packaging: 0.9, markup: 60, shippingCost: 7 },
      { name: 'Compression 3-Pack', pairs: 3, costPerPair: 3.9, packaging: 0.7, markup: 70, shippingCost: 6 },
      { name: 'Compression 6-Pack', pairs: 6, costPerPair: 3.7, packaging: 0.9, markup: 65, shippingCost: 7 }
    ],
    monthlyVolume: [
      { name: 'Diabetic 3-Pack', units: 150 },
      { name: 'Diabetic 6-Pack', units: 120 },
      { name: 'Compression 3-Pack', units: 180 },
      { name: 'Compression 6-Pack', units: 130 }
    ]
  };

  // Default fixed costs
  const defaultFixedCosts = {
    warehousing: 2500,
    shipping: 800,
    salaries: 12000,
    marketing: 3500,
    software: 500,
    tax: 2000,
    otherFixed: 1000
  };

  // State variables
  const [activeTab, setActiveTab] = useState('b2b');
  const [b2bData, setB2bData] = useState(defaultB2B);
  const [b2b2cData, setB2b2cData] = useState(defaultB2B2C);
  const [b2cData, setB2cData] = useState(defaultB2C);
  const [fixedCostsData, setFixedCostsData] = useState(defaultFixedCosts);
  const [b2bVolume, setB2bVolume] = useState(5);

  // Format currency 
  const formatCurrency = (amount) => {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  // Format percentage
  const formatPercent = (percent) => {
    return percent.toFixed(1) + '%';
  };

  // Calculate B2B results
  const calculateB2B = () => {
    const { minOrder, materials, labor, overhead, packaging, shipping, markup } = b2bData;
    const costPerUnit = materials + labor + overhead + packaging + shipping;
    const pricePerUnit = costPerUnit * (1 + markup / 100);
    const totalOrderCost = costPerUnit * minOrder;
    const totalOrderPrice = pricePerUnit * minOrder;
    const profit = totalOrderPrice - totalOrderCost;
    const profitMargin = (profit / totalOrderPrice) * 100;
    
    const monthlySales = totalOrderPrice * b2bVolume;
    const monthlyCost = totalOrderCost * b2bVolume;
    const monthlyProfit = profit * b2bVolume;
    
    return {
      costPerUnit,
      pricePerUnit,
      totalOrderCost,
      totalOrderPrice,
      profit,
      profitMargin,
      monthlySales,
      monthlyCost,
      monthlyProfit
    };
  };

  // Calculate B2B2C results
  const calculateB2B2C = () => {
    const { packages, selectedDecorationMethod } = b2b2cData;
    
    const calculatedPackages = packages.map(pkg => {
      let decorationCost = pkg.printingCost; // Default to printing
      if (selectedDecorationMethod === 'Embroidery') {
        decorationCost = pkg.printingCost + pkg.embroideryAdditional;
      } else if (selectedDecorationMethod === 'Woven Label') {
        decorationCost = pkg.printingCost + pkg.wovenLabelAdditional;
      }
      
      const costPerUnit = pkg.baseSockCost + decorationCost;
      const costPerPackage = (costPerUnit * pkg.quantity) + pkg.shippingCost;
      const pricePerPackage = costPerPackage * (1 + pkg.markup / 100);
      const profit = pricePerPackage - costPerPackage;
      const profitMargin = (profit / pricePerPackage) * 100;
      
      // Assume monthly sales volume based on package size
      const monthlySales = pkg.quantity === 20 ? 25 : (pkg.quantity === 60 ? 18 : 12);
      const monthlySalesValue = pricePerPackage * monthlySales;
      const monthlyCost = costPerPackage * monthlySales;
      const monthlyProfit = profit * monthlySales;
      
      return {
        ...pkg,
        decorationCost,
        costPerUnit,
        costPerPackage,
        pricePerPackage,
        profit,
        profitMargin,
        monthlySales,
        monthlySalesValue,
        monthlyCost,
        monthlyProfit
      };
    });
    
    const totalMonthlySales = calculatedPackages.reduce((sum, pkg) => sum + pkg.monthlySalesValue, 0);
    const totalMonthlyCost = calculatedPackages.reduce((sum, pkg) => sum + pkg.monthlyCost, 0);
    const totalMonthlyProfit = calculatedPackages.reduce((sum, pkg) => sum + pkg.monthlyProfit, 0);
    
    return {
      packages: calculatedPackages,
      totalMonthlySales,
      totalMonthlyCost,
      totalMonthlyProfit
    };
  };

  // Calculate B2C results
  const calculateB2C = () => {
    const { packages, monthlyVolume } = b2cData;
    
    const calculatedPackages = packages.map(pkg => {
      const totalCostPerPackage = (pkg.costPerPair * pkg.pairs) + pkg.packaging + pkg.shippingCost;
      const pricePerPackage = totalCostPerPackage * (1 + pkg.markup / 100);
      const profit = pricePerPackage - totalCostPerPackage;
      const profitMargin = (profit / pricePerPackage) * 100;
      
      // Find corresponding monthly volume
      const volume = monthlyVolume.find(v => v.name === pkg.name)?.units || 0;
      const monthlySales = pricePerPackage * volume;
      const monthlyCost = totalCostPerPackage * volume;
      const monthlyProfit = profit * volume;
      
      return {
        ...pkg,
        totalCostPerPackage,
        pricePerPackage,
        profit,
        profitMargin,
        volume,
        monthlySales,
        monthlyCost,
        monthlyProfit
      };
    });
    
    const totalMonthlySales = calculatedPackages.reduce((sum, pkg) => sum + pkg.monthlySales, 0);
    const totalMonthlyCost = calculatedPackages.reduce((sum, pkg) => sum + pkg.monthlyCost, 0);
    const totalMonthlyProfit = calculatedPackages.reduce((sum, pkg) => sum + pkg.monthlyProfit, 0);
    
    return {
      packages: calculatedPackages,
      totalMonthlySales,
      totalMonthlyCost,
      totalMonthlyProfit
    };
  };

  // Calculate income statement
  const generateIncomeStatement = () => {
    const b2bResults = calculateB2B();
    const b2b2cResults = calculateB2B2C();
    const b2cResults = calculateB2C();
    
    const totalRevenue = b2bResults.monthlySales + b2b2cResults.totalMonthlySales + b2cResults.totalMonthlySales;
    const totalCogs = b2bResults.monthlyCost + b2b2cResults.totalMonthlyCost + b2cResults.totalMonthlyCost;
    const grossProfit = totalRevenue - totalCogs;
    const grossMargin = (grossProfit / totalRevenue) * 100;
    
    const totalFixedCosts = Object.values(fixedCostsData).reduce((sum, cost) => sum + cost, 0);
    const operatingProfit = grossProfit - totalFixedCosts;
    const netMargin = (operatingProfit / totalRevenue) * 100;
    
    // Calculate revenue distribution for pie chart
    const revenueDistribution = [
      { name: 'B2B OEM', value: b2bResults.monthlySales },
      { name: 'B2B2C Custom', value: b2b2cResults.totalMonthlySales },
      { name: 'B2C Retail', value: b2cResults.totalMonthlySales }
    ];
    
    // Calculate profit distribution for pie chart
    const profitDistribution = [
      { name: 'B2B OEM', value: b2bResults.monthlyProfit },
      { name: 'B2B2C Custom', value: b2b2cResults.totalMonthlyProfit },
      { name: 'B2C Retail', value: b2cResults.totalMonthlyProfit }
    ];
    
    return {
      totalRevenue,
      totalCogs,
      grossProfit,
      grossMargin,
      totalFixedCosts,
      operatingProfit,
      netMargin,
      revenueDistribution,
      profitDistribution,
      b2bRevenue: b2bResults.monthlySales,
      b2b2cRevenue: b2b2cResults.totalMonthlySales,
      b2cRevenue: b2cResults.totalMonthlySales
    };
  };

  // Get calculated results
  const b2bResults = calculateB2B();
  const b2b2cResults = calculateB2B2C();
  const b2cResults = calculateB2C();
  const incomeStatement = generateIncomeStatement();

  // Save configuration to local storage
  const saveConfiguration = () => {
    try {
      const configuration = {
        b2bData,
        b2b2cData,
        b2cData,
        fixedCostsData,
        b2bVolume
      };
      
      localStorage.setItem('sockBusinessConfig', JSON.stringify(configuration));
      window.alert('Configuration saved successfully!');
    } catch (error) {
      window.alert('Error saving configuration: ' + error.message);
    }
  };

  // Load configuration from local storage
  const loadConfiguration = () => {
    try {
      const savedConfig = localStorage.getItem('sockBusinessConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setB2bData(config.b2bData);
        setB2b2cData(config.b2b2cData);
        setB2cData(config.b2cData);
        setFixedCostsData(config.fixedCostsData);
        setB2bVolume(config.b2bVolume);
        window.alert('Configuration loaded successfully!');
      } else {
        window.alert('No saved configuration found.');
      }
    } catch (error) {
      window.alert('Error loading configuration: ' + error.message);
    }
  };

  // Export to CSV
  const exportToCsv = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Income Statement
      csvContent += "Monthly Income Statement\n";
      csvContent += "Revenue,Amount\n";
      csvContent += `B2B OEM Revenue,${incomeStatement.b2bRevenue}\n`;
      csvContent += `B2B2C Custom Revenue,${incomeStatement.b2b2cRevenue}\n`;
      csvContent += `B2C Retail Revenue,${incomeStatement.b2cRevenue}\n`;
      csvContent += `Total Revenue,${incomeStatement.totalRevenue}\n\n`;
      
      csvContent += "COGS,Amount\n";
      csvContent += `Total COGS,${incomeStatement.totalCogs}\n\n`;
      
      csvContent += `Gross Profit,${incomeStatement.grossProfit}\n`;
      csvContent += `Gross Margin,${incomeStatement.grossMargin}%\n\n`;
      
      csvContent += "Fixed Expenses,Amount\n";
      Object.entries(fixedCostsData).forEach(([key, value]) => {
        csvContent += `${key.charAt(0).toUpperCase() + key.slice(1)},${value}\n`;
      });
      csvContent += `Total Fixed Expenses,${incomeStatement.totalFixedCosts}\n\n`;
      
      csvContent += `Operating Profit,${incomeStatement.operatingProfit}\n`;
      csvContent += `Net Margin,${incomeStatement.netMargin}%\n\n`;
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "sock_business_income_statement.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.alert('Error exporting to CSV: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sock Business Financial Planner</h1>
        <div className="flex space-x-2">
          <button 
            type="button"
            onClick={() => saveConfiguration()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Config
          </button>
          <button 
            type="button"
            onClick={() => loadConfiguration()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Load Config
          </button>
          <button 
            type="button"
            onClick={() => exportToCsv()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2 p-1 bg-gray-200 rounded-md">
          <button 
            className={`py-2 px-4 rounded-sm ${activeTab === 'b2b' ? 'bg-white shadow' : ''}`}
            onClick={() => setActiveTab('b2b')}
          >
            B2B OEM
          </button>
          <button 
            className={`py-2 px-4 rounded-sm ${activeTab === 'b2b2c' ? 'bg-white shadow' : ''}`}
            onClick={() => setActiveTab('b2b2c')}
          >
            B2B2C Custom
          </button>
          <button 
            className={`py-2 px-4 rounded-sm ${activeTab === 'b2c' ? 'bg-white shadow' : ''}`}
            onClick={() => setActiveTab('b2c')}
          >
            B2C Retail
          </button>
          <button 
            className={`py-2 px-4 rounded-sm ${activeTab === 'summary' ? 'bg-white shadow' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Financial Summary
          </button>
        </div>
      </div>

      {/* B2B Tab Content */}
      {activeTab === 'b2b' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold mb-2">B2B OEM Development</h2>
              <p className="text-sm text-gray-500 mb-4">Min. Order: {b2bData.minOrder} pairs</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cost Per Pair</p>
                  <p className="text-lg font-medium">{formatCurrency(b2bResults.costPerUnit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price Per Pair</p>
                  <p className="text-lg font-medium">{formatCurrency(b2bResults.pricePerUnit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Order Value</p>
                  <p className="text-lg font-medium">{formatCurrency(b2bResults.totalOrderPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profit Margin</p>
                  <p className="text-lg font-medium">{formatPercent(b2bResults.profitMargin)}</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold mb-2">Monthly B2B Projection</h2>
              <p className="text-sm text-gray-500 mb-4">Based on {b2bVolume} orders per month</p>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p>Monthly Revenue</p>
                  <p className="font-medium">{formatCurrency(b2bResults.monthlySales)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Monthly Cost</p>
                  <p className="font-medium">{formatCurrency(b2bResults.monthlyCost)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Monthly Profit</p>
                  <p className="font-medium">{formatCurrency(b2bResults.monthlyProfit)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">B2B Cost Parameters</h2>
            <p className="text-sm text-gray-500 mb-4">Adjust values to update calculations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Order (Pairs)</label>
                <input
                  type="number"
                  value={b2bData.minOrder}
                  onChange={(e) => setB2bData({...b2bData, minOrder: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Materials Cost ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={b2bData.materials}
                  onChange={(e) => setB2bData({...b2bData, materials: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Labor Cost ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={b2bData.labor}
                  onChange={(e) => setB2bData({...b2bData, labor: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Overhead Cost ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={b2bData.overhead}
                  onChange={(e) => setB2bData({...b2bData, overhead: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Packaging Cost ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={b2bData.packaging}
                  onChange={(e) => setB2bData({...b2bData, packaging: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shipping Cost ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={b2bData.shipping}
                  onChange={(e) => setB2bData({...b2bData, shipping: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Markup (%)</label>
                <input
                  type="number"
                  step="1"
                  value={b2bData.markup}
                  onChange={(e) => setB2bData({...b2bData, markup: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Orders</label>
                <input
                  type="number"
                  step="1"
                  value={b2bVolume}
                  onChange={(e) => setB2bVolume(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B2B2C Tab Content */}
      {activeTab === 'b2b2c' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {b2b2cResults.packages.map((pkg, index) => (
              <div key={index} className="border rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-2">{pkg.name} Package</h2>
                <p className="text-sm text-gray-500 mb-4">{pkg.quantity} pairs with {b2b2cData.selectedDecorationMethod}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost per Package:</span>
                    <span>{formatCurrency(pkg.costPerPackage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Package:</span>
                    <span>{formatCurrency(pkg.pricePerPackage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit per Package:</span>
                    <span>{formatCurrency(pkg.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin:</span>
                    <span>{formatPercent(pkg.profitMargin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Units:</span>
                    <span>{pkg.monthlySales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Revenue:</span>
                    <span>{formatCurrency(pkg.monthlySalesValue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">B2B2C Monthly Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(b2b2cResults.totalMonthlySales)}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Monthly Cost</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(b2b2cResults.totalMonthlyCost)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Monthly Profit</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(b2b2cResults.totalMonthlyProfit)}</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">B2B2C Customization Parameters</h2>
            <p className="text-sm text-gray-500 mb-4">Select decoration method and adjust costs</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Decoration Method:</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Printing"
                    checked={b2b2cData.selectedDecorationMethod === "Printing"}
                    onChange={() => setB2b2cData({...b2b2cData, selectedDecorationMethod: "Printing"})}
                    className="mr-2"
                  />
                  Printing
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Embroidery"
                    checked={b2b2cData.selectedDecorationMethod === "Embroidery"}
                    onChange={() => setB2b2cData({...b2b2cData, selectedDecorationMethod: "Embroidery"})}
                    className="mr-2"
                  />
                  Embroidery
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Woven Label"
                    checked={b2b2cData.selectedDecorationMethod === "Woven Label"}
                    onChange={() => setB2b2cData({...b2b2cData, selectedDecorationMethod: "Woven Label"})}
                    className="mr-2"
                  />
                  Woven Label
                </label>
              </div>
            </div>
            
            <div className="space-y-6">
              {b2b2cData.packages.map((pkg, index) => (
                <div key={index} className="border p-4 rounded">
                  <h3 className="font-medium mb-2">{pkg.name} Package ({pkg.quantity} pairs)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Base Sock Cost ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pkg.baseSockCost}
                        onChange={(e) => {
                          const newPackages = [...b2b2cData.packages];
                          newPackages[index].baseSockCost = parseFloat(e.target.value) || 0;
                          setB2b2cData({...b2b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Printing Cost ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pkg.printingCost}
                        onChange={(e) => {
                          const newPackages = [...b2b2cData.packages];
                          newPackages[index].printingCost = parseFloat(e.target.value) || 0;
                          setB2b2cData({...b2b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Embroidery Additional ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pkg.embroideryAdditional}
                        onChange={(e) => {
                          const newPackages = [...b2b2cData.packages];
                          newPackages[index].embroideryAdditional = parseFloat(e.target.value) || 0;
                          setB2b2cData({...b2b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Woven Label Additional ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pkg.wovenLabelAdditional}
                        onChange={(e) => {
                          const newPackages = [...b2b2cData.packages];
                          newPackages[index].wovenLabelAdditional = parseFloat(e.target.value) || 0;
                          setB2b2cData({...b2b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Shipping Cost to USA ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pkg.shippingCost}
                        onChange={(e) => {
                          const newPackages = [...b2b2cData.packages];
                          newPackages[index].shippingCost = parseFloat(e.target.value) || 0;
                          setB2b2cData({...b2b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Shipping Cost to USA ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pkg.shippingCost}
                        onChange={(e) => {
                          const newPackages = [...b2cData.packages];
                          newPackages[index].shippingCost = parseFloat(e.target.value) || 0;
                          setB2cData({...b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Markup (%)</label>
                      <input
                        type="number"
                        step="1"
                        value={pkg.markup}
                        onChange={(e) => {
                          const newPackages = [...b2b2cData.packages];
                          newPackages[index].markup = parseFloat(e.target.value) || 0;
                          setB2b2cData({...b2b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* B2C Tab Content */}
      {activeTab === 'b2c' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {b2cResults.packages.map((pkg, index) => (
              <div key={index} className="border rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-2">{pkg.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{pkg.pairs} pairs per package</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost per Package:</span>
                    <span>{formatCurrency(pkg.totalCostPerPackage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Package:</span>
                    <span>{formatCurrency(pkg.pricePerPackage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit per Package:</span>
                    <span>{formatCurrency(pkg.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin:</span>
                    <span>{formatPercent(pkg.profitMargin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Units Sold:</span>
                    <span>{pkg.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Revenue:</span>
                    <span>{formatCurrency(pkg.monthlySales)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">B2C Monthly Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(b2cResults.totalMonthlySales)}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Monthly Cost</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(b2cResults.totalMonthlyCost)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Monthly Profit</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(b2cResults.totalMonthlyProfit)}</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">B2C Product Parameters</h2>
            <p className="text-sm text-gray-500 mb-4">Adjust product costs and sales projections</p>
            <div className="space-y-6">
              {b2cData.packages.map((pkg, index) => (
                <div key={index} className="border p-4 rounded">
                  <h3 className="font-medium mb-2">{pkg.name} ({pkg.pairs} pairs)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cost Per Pair ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pkg.costPerPair}
                        onChange={(e) => {
                          const newPackages = [...b2cData.packages];
                          newPackages[index].costPerPair = parseFloat(e.target.value) || 0;
                          setB2cData({...b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Packaging Cost ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pkg.packaging}
                        onChange={(e) => {
                          const newPackages = [...b2cData.packages];
                          newPackages[index].packaging = parseFloat(e.target.value) || 0;
                          setB2cData({...b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Markup (%)</label>
                      <input
                        type="number"
                        step="1"
                        value={pkg.markup}
                        onChange={(e) => {
                          const newPackages = [...b2cData.packages];
                          newPackages[index].markup = parseFloat(e.target.value) || 0;
                          setB2cData({...b2cData, packages: newPackages});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Sales Volume</label>
                      <input
                        type="number"
                        step="1"
                        value={b2cData.monthlyVolume.find(v => v.name === pkg.name)?.units || 0}
                        onChange={(e) => {
                          const newMonthlyVolume = [...b2cData.monthlyVolume];
                          const volumeIndex = newMonthlyVolume.findIndex(v => v.name === pkg.name);
                          if (volumeIndex >= 0) {
                            newMonthlyVolume[volumeIndex].units = parseInt(e.target.value) || 0;
                          }
                          setB2cData({...b2cData, monthlyVolume: newMonthlyVolume});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Financial Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold mb-2">Monthly Income Statement</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">Revenue</h3>
                  <div className="ml-4 space-y-1">
                    <div className="flex justify-between">
                      <span>B2B OEM Revenue</span>
                      <span>{formatCurrency(incomeStatement.b2bRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>B2B2C Custom Revenue</span>
                      <span>{formatCurrency(incomeStatement.b2b2cRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>B2C Retail Revenue</span>
                      <span>{formatCurrency(incomeStatement.b2cRevenue)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Revenue</span>
                      <span>{formatCurrency(incomeStatement.totalRevenue)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Cost of Goods Sold</h3>
                  <div className="ml-4 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>Total COGS</span>
                      <span>{formatCurrency(incomeStatement.totalCogs)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Gross Profit</span>
                  <span>{formatCurrency(incomeStatement.grossProfit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gross Margin</span>
                  <span>{formatPercent(incomeStatement.grossMargin)}</span>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Fixed Expenses</h3>
                  <div className="ml-4 space-y-1">
                    {Object.entries(fixedCostsData).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span>{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium">
                      <span>Total Fixed Expenses</span>
                      <span>{formatCurrency(incomeStatement.totalFixedCosts)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Operating Profit</span>
                  <span>{formatCurrency(incomeStatement.operatingProfit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Net Margin</span>
                  <span>{formatPercent(incomeStatement.netMargin)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-2">Revenue Distribution</h2>
                <div className="flex justify-around p-4">
                  {incomeStatement.revenueDistribution.map((item, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-2" 
                        style={{ backgroundColor: ['#0088FE', '#00C49F', '#FFBB28'][index] }}
                      ></div>
                      <p className="text-sm">{item.name}</p>
                      <p className="font-bold">{formatCurrency(item.value)}</p>
                      <p className="text-xs">
                        {((item.value / incomeStatement.totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-2">Profit Distribution</h2>
                <div className="flex justify-around p-4">
                  {incomeStatement.profitDistribution.map((item, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-2" 
                        style={{ backgroundColor: ['#0088FE', '#00C49F', '#FFBB28'][index] }}
                      ></div>
                      <p className="text-sm">{item.name}</p>
                      <p className="font-bold">{formatCurrency(item.value)}</p>
                      <p className="text-xs">
                        {((item.value / incomeStatement.operatingProfit) * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Fixed Costs</h2>
            <p className="text-sm text-gray-500 mb-4">Adjust monthly fixed expenses</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(fixedCostsData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)} ($)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={value}
                    onChange={(e) => {
                      setFixedCostsData({
                        ...fixedCostsData, 
                        [key]: parseFloat(e.target.value) || 0
                      });
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Breakeven Analysis</h2>
            <p className="text-sm text-gray-500 mb-4">Units needed to sell to cover fixed costs</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">B2B Breakeven (Orders)</p>
                <p className="text-xl font-bold text-blue-600">
                  {Math.ceil(incomeStatement.totalFixedCosts / (b2bResults.profit * b2bVolume / b2bVolume))}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">B2B2C Breakeven (Packages)</p>
                <p className="text-xl font-bold text-green-600">
                  {Math.ceil(incomeStatement.totalFixedCosts / (b2b2cResults.totalMonthlyProfit / 
                    b2b2cResults.packages.reduce((total, pkg) => total + pkg.monthlySales, 0)))}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-500">B2C Breakeven (Packages)</p>
                <p className="text-xl font-bold text-purple-600">
                  {Math.ceil(incomeStatement.totalFixedCosts / (b2cResults.totalMonthlyProfit / 
                    b2cResults.packages.reduce((total, pkg) => total + pkg.volume, 0)))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 pt-4 border-t text-center text-gray-500">
        <p>Sock Business Financial Planner © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default SockBusinessApp;