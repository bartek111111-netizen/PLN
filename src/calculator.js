// PLNoże Calculator Logic
// For slitting knives on steel plates machine

export class SlittingCalculator {
  constructor() {
    this.panels = {
      panel1: {},
      panel2: {}
    };
    
    // Spacers table (mm)
    this.spacers = [
      1.5, 1.8, 2, 2.05, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 
      2.7, 2.8, 2.9, 3, 4, 5, 6, 7, 8, 9, 
      9.15, 9.2, 9.25, 9.3, 9.35, 9.4, 9.45, 9.5, 10, 15, 
      20, 30, 40, 50
    ];
    
    // Gums table (20mm, different colors)
    this.gums = [
      { size: 20, color: 'blue' },
      { size: 20, color: 'red' },
      { size: 20, color: 'yellow' }
    ];
    
    // Knives table (mm)
    this.knives = [9, 12, 20];
  }

  // Get spacers list
  getSpacers() {
    return this.spacers;
  }

  // Get gums list
  getGums() {
    return this.gums;
  }

  // Get knives list
  getKnives() {
    return this.knives;
  }

  // Panel 1 - Get values
  getPanel1Values() {
    return this.panels.panel1;
  }

  setPanel1Values(data) {
    this.panels.panel1 = { ...data };
  }

  // Panel 2 - Get values
  getPanel2Values() {
    return this.panels.panel2;
  }

  setPanel2Values(data) {
    this.panels.panel2 = { ...data };
  }

  // Calculate function - add your logic here
  calculate(panelNumber, values) {
    if (panelNumber === 1) {
      // Panel 1 calculation logic
      return this.calculatePanel1(values);
    } else if (panelNumber === 2) {
      // Panel 2 calculation logic
      return this.calculatePanel2(values);
    }
  }

  calculatePanel1(values) {
    // values.field1 = width (20-1600mm)
    // values.field2 = thickness (0.5-7mm)
    // values.field3 = knife size (9, 12, 20mm)
    
    const width = parseFloat(values.field1);
    const thickness = parseFloat(values.field2);
    const knifeSize = parseFloat(values.field3);
    
    // Check if width is at least 2x the knife size
    if (width < knifeSize * 2) {
      throw new Error(`Szerokość cięcia (${width}mm) musi być co najmniej 2x rozmiar noża (${knifeSize}mm). Podaj większą liczbę dla szerokości cięcia albo wybierz mniejszy rozmiar noża.`);
    }
    
    // Build the layout
    const layout = [];
    
    // Add left knife
    layout.push({
      type: 'knife',
      size: knifeSize,
      color: 'gray'
    });
    
    // Calculate remaining width after both knives
    let remainingWidth = width - (knifeSize * 2);
    
    // Add blue gums near knives if remaining width > 20mm
    if (remainingWidth > 20) {
      layout.push({
        type: 'gum',
        size: 20,
        color: 'blue'
      });
      remainingWidth -= 20;
    }
    
    // Add spacers to fill remaining width
    // For now, just store the remaining width as spacer info
    if (remainingWidth > 0) {
      layout.push({
        type: 'spacers',
        totalWidth: remainingWidth
      });
    }
    
    // Add blue gum near right knife if we added one near left
    if (width - (knifeSize * 2) > 20) {
      layout.push({
        type: 'gum',
        size: 20,
        color: 'blue'
      });
    }
    
    // Add right knife
    layout.push({
      type: 'knife',
      size: knifeSize,
      color: 'gray'
    });
    
    console.log('Panel 1 calculation with:', values);
    console.log('Layout:', layout);
    return layout;
  }

  calculatePanel2(values) {
    // Add your calculation logic here
    console.log('Panel 2 calculation with:', values);
    return null;
  }

  // Save to localStorage
  saveToStorage() {
    localStorage.setItem('slittingCalc', JSON.stringify(this.panels));
  }

  // Load from localStorage
  loadFromStorage() {
    const saved = localStorage.getItem('slittingCalc');
    if (saved) {
      const data = JSON.parse(saved);
      this.panels = data;
    }
  }
}

export default new SlittingCalculator();
