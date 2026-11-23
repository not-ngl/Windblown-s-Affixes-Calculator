// probability.js - Single value probability calculator

window.ProbabilityCalculator = {
  UPGRADE_CONFIG: {
    0: { p: 0, q: 1, maxRare: 0 },
    1: { p: 0.05, q: 0.95, maxRare: 1 },
    2: { p: 0.10, q: 0.90, maxRare: 1 },
    3: { p: 0.10, q: 0.90, maxRare: 4 }
  },

  getPoolSize: function(Nc, Nu) {
    return 2 * Nc + Nu;
  },

  /**
   * 1-slot, 1-selected
   * Returns probability of getting the selection made
   */
  calc1_1: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) { 
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = this.UPGRADE_CONFIG[upgrade].p;
    const q = (Nr < 1) ? 1 : 1 - p;
    
    if (NrAsked === 1) return p / Nr;
    if (NuAsked === 1) return q / S;
    if (NcAsked === 1) return 2 * q / S;
    
    return 0;
  },

  /**
   * 2-slots available, 1-selected
   * Returns probability of getting the selection made (only 1 affix selected)
   */
  calc2_1: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) {  
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;
    const q = 1 - p;
    
    if (upgrade === 3) {
      if (NrAsked === 1) {
        const R  =    p / Nr;
        const rR =    p * (Nr-1)/Nr * this.calc1_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        return R + rR;
      }
      if (NuAsked === 1) {
        const r =    p          * this.calc1_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const c =    q*  2*Nc/S * this.calc1_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*(Nu-1)/S * this.calc1_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const U =    q*1/S;
	return r + c + u + U;
      }
      if (NcAsked === 1) {
        const r =    p            * this.calc1_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const c =    q*2*(Nc-1)/S * this.calc1_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*      Nu/S * this.calc1_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const C =    q*2/S;
	return r + c + u + C;
      }
    } else {
      if (NrAsked === 1) return p / Nr;
      if (NuAsked === 1) {
        const r =    p          * this.calc1_1(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c =    q*  2*Nc/S * this.calc1_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*(Nu-1)/S * this.calc1_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const U =    q*1/S;
	return r + c + u + U;
      }
      if (NcAsked === 1) {
        const r =    p            * this.calc1_1(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c =    q*2*(Nc-1)/S * this.calc1_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*      Nu/S * this.calc1_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const C =    q*2/S;
	return r + c + u + C;
      }
    }
    
    return 0;
  },

  /**
   * 2-slots available, 2-selected
   * Returns probability of getting the selection made
   * nrAsked, nuAsked, nCAsked must sum to slotsSelected
   */
  calc2_2: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) { 
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = this.UPGRADE_CONFIG[upgrade].p;
    const q = (Nr < 1) ? 1 : 1 - p;
    
    if (upgrade === 3) {
      if (NrAsked === 2) {
        return 2*p/Nr * this.calc1_1(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      }
      if (NrAsked === 1 && NuAsked === 1) {
        return p/Nr * this.calc1_1(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      }
      if (NrAsked === 1 && NcAsked === 1) {
        return p/Nr * this.calc1_1(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      }
      if (NuAsked === 2) {
        return 2*q/S * this.calc1_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
      }
      if (NcAsked === 2) {
        return 2*2*q/S * this.calc1_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
      }
      if (NuAsked === 1 && NcAsked === 1) {
        const U = q/S   * this.calc1_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C = 2*q/S * this.calc1_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
        return U + C;
      }
    } else {
      if (NrAsked === 1 && NuAsked === 1) {
        return p/Nr * this.calc1_1(Nr-1, Nu, Nc, 0, NrAsked-1, NuAsked, NcAsked);
      }
      if (NrAsked === 1 && NcAsked === 1) {
        return p/Nr * this.calc1_1(Nr-1, Nu, Nc, 0, NrAsked-1, NuAsked, NcAsked);
      }
      if (NuAsked === 2) {
        return 2*q/S * this.calc1_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
      }
      if (NcAsked === 2) {
        return 2*2*q/S * this.calc1_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
      }
      if (NuAsked === 1 && NcAsked === 1) {
        const U = q/S   * this.calc1_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C = 2*q/S * this.calc1_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
        return U + C;
      }
    }
    return 0;
  },

  /**
   * 3-slots available, 1-selected
   * Returns probability of getting the selection made (only 1 affix selected)
   */
  calc3_1: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) { 
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;
    const q = 1 - p;
   
    if (Nr < NrAsked) return 0;
    if (upgrade === 3) {
      if (NrAsked === 1) { 
        const R  =    p / Nr;
        const rR =    p * (Nr-1)/Nr * this.calc2_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        return R + rR;
      }
      if (NuAsked === 1) {
        const r =    p          * this.calc2_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const c =    q*  2*Nc/S * this.calc2_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*(Nu-1)/S * this.calc2_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const U =    q*1/S;
	return r + c + u + U;
      }
      if (NcAsked === 1) {
        const r =    p            * this.calc2_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const c =    q*2*(Nc-1)/S * this.calc2_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*      Nu/S * this.calc2_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const C =    q*2/S;
	return r + c + u + C;
      }
    } else {
      if (NrAsked === 1) return p / Nr;
      if (NuAsked === 1) {
        const r =    p          * this.calc2_1(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c =    q*  2*Nc/S * this.calc2_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*(Nu-1)/S * this.calc2_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const U =    q*1/S;
	return r + c + u + U;
      }
      if (NcAsked === 1) {
        const r =    p            * this.calc2_1(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c =    q*2*(Nc-1)/S * this.calc2_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*      Nu/S * this.calc2_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const C =    q*2/S;
	return r + c + u + C;
      }
    }
    return 0;

  },

  /**
   * 3-slots available, 2-selected
   * Returns probability of getting the selection made (2 affixes selected)
   */
  calc3_2: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) { 
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;
    const q = 1 - p;
    
    if (Nr < NrAsked) return 0;
    if (upgrade === 3) {
      if (NrAsked === 2) { 
        const R  =    2*p / Nr * this.calc2_1(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
        const rR =    p * (Nr-2)/Nr * this.calc2_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        return R + rR;
      }
      if (NuAsked === 2) {
        const r =    p          * this.calc2_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const c =    q*  2*Nc/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*(Nu-2)/S * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const U =    2*q*1/S * this.calc2_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
	return r + c + u + U;
      }
      if (NcAsked === 2) {
        const r =    p            * this.calc2_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const c =    q*2*(Nc-2)/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*      Nu/S * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const C =    2*q*2/S * this.calc2_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	return r + c + u + C;
      }
      if (NrAsked === 1) {
        const r =    p*(Nr-1)/Nr  * this.calc2_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const R =    p/Nr         * this.calc2_1(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
	return r + R;
      }
      if (NcAsked === 1 && NuAsked === 1) {
        const r =    p            * this.calc2_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const u =    q*(Nu-1)/S   * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c =    2*q*(Nc-1)/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const U =    q/S   * this.calc2_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C =    2*q/S * this.calc2_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	return r + u + c + U + C;
      }
    } else { 
      if (NuAsked === 2) {
        const r =    p          * this.calc2_2(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c =    q*  2*Nc/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*(Nu-2)/S * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const U =    2*q*1/S * this.calc2_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
	return r + c + u + U;
      }
      if (NcAsked === 2) {
        const r =    p            * this.calc2_2(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c =    q*2*(Nc-2)/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*      Nu/S * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const C =    2*q*2/S * this.calc2_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	return r + c + u + C;
      }
      if (NrAsked === 1) {
        return p/Nr         * this.calc2_1(Nr-1, Nu, Nc, 0, NrAsked-1, NuAsked, NcAsked);
      }
      if (NcAsked === 1 && NuAsked === 1) {
        const r =    p            * this.calc2_2(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const u =    q*(Nu-1)/S   * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c =    2*q*(Nc-1)/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const U =    q/S   * this.calc2_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C =    2*q/S * this.calc2_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	return r + u + c + U + C;
      }
    }
    return 0;
  },

  /**
   * 3-slots available, 3-selected
   * Returns probability of getting the selection made
   */
  calc3_3: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) { 
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;
    const q = 1 - p;
    
    if (Nr < NrAsked) return 0;
    if (upgrade === 3) {
      if (NrAsked === 3) { 
        return 3*p / Nr * this.calc2_2(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      }
      if (NuAsked === 3) {
        return 3*q*1/S * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
      }
      if (NcAsked === 3) {
        return 3*q*2/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
      }
      if (NrAsked === 2) {
        return 2*p/Nr * this.calc2_2(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      }
      if (NrAsked === 1) {
        return p/Nr * this.calc2_2(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      }
      if (NcAsked === 2 && NuAsked === 1) {
        const U =    q/S     * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C =    2*2*q/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	return U + C;
      }
      if (NcAsked === 1 && NuAsked === 2) {
        const U =    2*q/S * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C =    2*q/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	return U + C;
      }
    } else {
      if (NuAsked === 3) {
        return 3*q*1/S * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
      }
      if (NcAsked === 3) {
        return 3*q*2/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
      }
      if (NrAsked === 1) {
        return p/Nr * this.calc2_2(Nr-1, Nu, Nc, 0, NrAsked-1, NuAsked, NcAsked);
      }
      if (NcAsked === 2 && NuAsked === 1) {
        const U =    q/S     * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C =    2*2*q/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	return U + C;
      }
      if (NcAsked === 1 && NuAsked === 2) {
        const U =    2*q/S * this.calc2_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C =    2*q/S * this.calc2_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	return U + C;
      }
    }
    return 0;

  },

  /**
   * 4-slots available, 1-selected
   * Returns probability of getting the selection made (only 1 affix selected)
   */
  calc4_1: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) {
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;
    const q = 1 - p;
    
    if (upgrade === 3) { 
      if (NrAsked === 1) {
        const r =     p * (Nr-1)/Nr * this.calc3_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const R = p / Nr;
        return r + R;
      }
      if (NuAsked === 1) {
        const u =     q * (Nu-1)/S * this.calc3_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q *     Nc/S * this.calc3_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *            this.calc3_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const U = q / S;
        return u + c + r + U;
      }
      if (NcAsked === 1) {
        const u =     q *     Nu/S * this.calc3_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-1)/S * this.calc3_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *            this.calc3_1(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const C = 2 * q / S;
        return u + c + r + C;
      }
    } else { 
      if (NrAsked === 1) return p / Nr;
      if (NuAsked === 1) {
        const u =     q * (Nu-1)/S * this.calc3_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q *     Nc/S * this.calc3_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *            this.calc3_1(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const U = q / S;
        return u + c + r + U;
      }
      if (NcAsked === 1) {
        const u =     q *     Nu/S * this.calc3_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-1)/S * this.calc3_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *            this.calc3_1(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
        const C = 2 * q / S;
        return u + c + r + C;
      }
    }
    return 0;

  },

  /**
   * 4-slots available, 2-selected
   * Returns probability of getting the selection made
   */
  calc4_2: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) { 
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;
    const q = 1 - p;
    
    if (upgrade === 3) {
      if (NrAsked === 2) {
        const r =     p * (Nr-2) /Nr * this.calc3_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const R =   2*p /Nr * this.calc3_1(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
        return r + R;
      }
      if (NuAsked === 2) {
        const u =     q * (Nu-2) / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q *     Nc / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p              * this.calc3_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const U = 2 * q /S * this.calc3_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return r + u + c + U;
      }
      if (NcAsked === 2) {
        const u =     q *     Nu / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-2) / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p              * this.calc3_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const C = 4 * q / S * this.calc3_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
        return r + u + c + C;
      }
      if (NrAsked === 1) {
        const r =     p * (Nr-1) /Nr * this.calc3_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const R =     p /Nr * this.calc3_1(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
        return r + R;
      }
      if (NuAsked === 1 && NcAsked === 1) {
        const u =     q * (Nu-1) / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-1) / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_2(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
	const U =     q / S * this.calc3_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C = 2 * q / S * this.calc3_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
        return r + u + c + U + C;
      }
    } else {
      if (NuAsked === 2) {
        const u =     q * (Nu-2) / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q *     Nc / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_2(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
	const U = 2 * q / S * this.calc3_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return u + c + r + U;
      }
      if (NcAsked === 2) {
        const u =     q *     Nu / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-2) / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_2(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
	const C = 4 * q / S * this.calc3_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
        return u + c + r + C;
      }
      if (NcAsked === 1 && NuAsked === 1) {
        const u =     q * (Nu-1) / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-1) / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_2(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
	const C = 2 * q / S * this.calc3_1(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U =     q / S * this.calc3_1(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return u + c + r + C + U;
      }
      if (NrAsked === 1) {
        return p / Nr * this.calc3_1(Nr-1, Nu, Nc, 0, NrAsked-1, NuAsked, NcAsked);
      }
    }
    return 0;
  },


  /**
   * 4-slots available, 3-selected
   * Returns probability of getting the selection made
   */
  calc4_3: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) { 
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;
    const q = 1 - p;
    
    if (upgrade === 3) {
      if (NrAsked === 3) {
        const r =     p * (Nr-3)/Nr * this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
	const R = 3 * p         /Nr * this.calc3_2(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
        return r + R;
      } 
      if (NuAsked === 3) {
        const u =     q * (Nu-3) / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q *     Nc / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
	const U = 3 * q / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return r + u + c + U;
      }
      if (NcAsked === 3) {
        const u =     q *     Nu / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-3) / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
	const C = 6 * q / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
        return r + u + c + C;
      }
      if (NrAsked === 2) {
        const r =     p * (Nr-2) /Nr * this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const R =     2*p        /Nr * this.calc3_2(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
        return r + R;
      }
      if (NrAsked === 1) {
        const r =     p * (Nr-1) /Nr * this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
        const R =     p          /Nr * this.calc3_2(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
        return r + R;
      }
      if (NuAsked === 2 && NcAsked === 1) {
        const u =     q * (Nu-2) / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-1) / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
	const U = 2 * q / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        const C = 2 * q / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
        return r + u + c + U + C;
      }
      if (NcAsked === 2 && NuAsked === 1) {
        const u =     q * (Nu-1) / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-2) / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
	const U =     q / S * this.calc3_2(Nr, Nu-1, Nc, 0, 0, NuAsked-1, NcAsked);
        const C = 4 * q / S * this.calc3_2(Nr, Nu, Nc-1, 0, 0, NuAsked, NcAsked-1);
        return r + u + c + U + C;
      }
    } else {
      if (NuAsked === 3) {
        const u =     q * (Nu-3) / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q *     Nc / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_3(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
	const U = 3 * q / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return u + c + r + U;
      }
      if (NcAsked === 3) {
        const u =     q *     Nu / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-3) / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_3(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
	const C = 6 * q / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
        return u + c + r + C;
      }
      if (NcAsked === 2 && NuAsked === 1) {
        const u =     q * (Nu-1) / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-2) / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_3(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
	const C = 4 * q / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U =     q / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return u + c + r + C + U;
      }
      if (NuAsked === 2 && NcAsked === 1) {
        const u =     q * (Nu-2) / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked, NcAsked);
        const c = 2 * q * (Nc-1) / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked);
        const r =     p *              this.calc3_3(Nr-1, Nu, Nc, 0, NrAsked, NuAsked, NcAsked);
	const C = 2 * q / S * this.calc3_2(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U = 2 * q / S * this.calc3_2(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return u + c + r + C + U;
      }
      if (NrAsked === 1) {
        return p / Nr * this.calc3_2(Nr-1, Nu, Nc, 0, NrAsked-1, NuAsked, NcAsked);
      }
    }
    return 0;
  },

  /**
   * 4-slots available, 4-selected
   * Returns probability of getting the selection made
   */
  calc4_4: function(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked) { 
    if NrAsked > Nr return 0;
    const S = this.getPoolSize(Nc, Nu);
    const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;
    const q = 1 - p;
    
    if (upgrade === 3) {
      if (NrAsked === 4) return 4 * p / Nr * this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      if (NuAsked === 4) return 4 * q / S  * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
      if (NcAsked === 4) return 4*2*q / S  * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
      if (NrAsked === 3) return 3 * p / Nr * this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      if (NrAsked === 2) return 2 * p / Nr * this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      if (NrAsked === 1) return 1 * p / Nr * this.calc3_3(Nr-1, Nu, Nc, upgrade, NrAsked-1, NuAsked, NcAsked);
      if (NcAsked === 3 && NuAsked === 1) {
	const C = 3*2*q / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U =     q / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return C + U;
      }
      if (NuAsked === 3 && NcAsked === 1) {
	const C = 2 * q / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U = 3 * q / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return C + U;
      }
      if (NcAsked === 2 && NuAsked === 2) {
	const C = 2*2*q / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U = 2 * q / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return C + U;
      }
    } else {
      if (NuAsked === 4) return 4 * q / S  * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
      if (NcAsked === 4) return 4*2*q / S  * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
      if (NcAsked === 3 && NuAsked === 1) {
	const C = 3*2*q / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U =     q / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return C + U;
      }
      if (NuAsked === 3 && NcAsked === 1) {
	const C = 2 * q / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U = 3 * q / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return C + U;
      }
      if (NrAsked === 1) return p / Nr * this.calc3_3(Nr-1, Nu, Nc, 0, NrAsked-1, NuAsked, NcAsked);
      if (NcAsked === 2 && NuAsked === 2) {
	const C = 2*2*q / S * this.calc3_3(Nr, Nu, Nc-1, 0, NrAsked, NuAsked, NcAsked-1);
	const U = 2 * q / S * this.calc3_3(Nr, Nu-1, Nc, 0, NrAsked, NuAsked-1, NcAsked);
        return C + U;
      }
    }
    return 0;

  },

  /**
   * Main dispatcher - returns single probability value
   */
  calculateProbabilities: function(Nr, Nu, Nc, upgrade, slotsAvailable, slotsSelected, NrAsked, NuAsked, NcAsked) {
    if (Nr < 0 || Nu < 0 || Nc < 0) throw new Error('Affix counts cannot be negative');
    if (slotsSelected > slotsAvailable) throw new Error('Cannot select more slots than available');
    if (NrAsked + NuAsked + NcAsked !== slotsSelected) throw new Error('Requested affix count does not match slots selected');
    if (slotsSelected === 0) return 0;
    
    const config = this.UPGRADE_CONFIG[upgrade];
    if (!config) throw new Error(`Invalid upgrade level: ${upgrade}. Must be 0-3.`);
    
    const key = `${slotsAvailable}-${slotsSelected}`;
    
    switch (key) {
      case '1-1':
        return this.calc1_1(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '2-1':
        return this.calc2_1(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '2-2':
        return this.calc2_2(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '3-1':
        return this.calc3_1(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '3-2':
        return this.calc3_2(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '3-3':
        return this.calc3_3(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '4-1':
        return this.calc4_1(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '4-2':
        return this.calc4_2(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '4-3':
        return this.calc4_3(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      case '4-4':
        return this.calc4_4(Nr, Nu, Nc, upgrade, NrAsked, NuAsked, NcAsked);
      default:
        throw new Error(`Formula not implemented yet: ${slotsAvailable} slots, ${slotsSelected} selected`);
    }
  }
};
