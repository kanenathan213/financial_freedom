describe('Unit: RetirementCalculatorModule', function() {
    var RetirementCalculatorService;

    beforeEach(module('RetirementCalculatorModule'));
    
    beforeEach(inject(function(_RetirementCalculatorService_) {
        RetirementCalculatorService = _RetirementCalculatorService_;
    }));
    
    // calculatePeriodInterestRate
    it('should have calculatePeriodInterestRate function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculatePeriodInterestRate)).toBe(true);
    });
    
    it('should convert 10% annual to .797% monthly from calculatePeriodInterestRate', function() {
        var val = RetirementCalculatorService.calculatePeriodInterestRate(.10, 12);
        rounded = Math.round(val * 100000) / 100000;
        expect(rounded).toBe(.00797);
    });
    
    it('should convert 6% annual to .487% monthly from calculatePeriodInterestRate', function() {
        var val = RetirementCalculatorService.calculatePeriodInterestRate(.06, 12);
        rounded = Math.round(val * 100000) / 100000;
        expect(rounded).toBe(.00487);
    });
    
    // calculateMonthsToRetirement
    it('should have calculateMonthsToRetirement function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculateMonthsToRetirement)).toBe(true);
    });
    
    it('should return 1200 months for zero net worth and zero income from calculatMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(5000);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months).toBe(1200);
    });
    
    it('should return 0 months for someone with no expenses and positive net worth from calculateMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(50000);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months).toBe(0);
    });
    
    it('should return 0 months for someone with no expenses and positive take home pay from calculateMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(1000);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months).toBe(0);
    });
    
    it('should return within a reasonable range of months for someone who has normal expenses, salary, and net worth from calculateMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months).toBeLessThan(300);
        expect(val.months).toBeGreaterThan(12);
    });
    
    it('should return can_retire false for zero net worth and zero income from calculatMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(5000);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.can_retire).toBe(false);
    });
    
    it('should return can_retire_immediately true for someone with no expenses and positive net worth from calculateMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(50000);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.can_retire_immediately).toBe(true);
    });
    
    it('should return can_retire_immediately true for someone with no expenses and positive take home pay from calculateMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(1000);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.can_retire_immediately).toBe(true);
    });
    
    it('should return can_retire true for someone who has normal expenses, salary, and net worth from calculateMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.can_retire).toBe(true);
    });
    
    it('should return points_for_intersection for someone with reasonable financial values', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.points_for_intersection).not.toBe(undefined);
    });
    
    it('should have points_for_intersection that are right at the point where withdrawal limit just exceeds expenses for someone with reasonable financial values', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        var first_point = val.points_for_intersection[0];
        var second_point = val.points_for_intersection[1];
        
        expect(first_point.expenses).toBeGreaterThan(first_point.withdraw_limit);
        expect(second_point.expenses).toBeLessThan(second_point.withdraw_limit);
    });
    
    // This makes sense because the number of months starts at 0, so it is essentially 0 indexed
    // just like the list of data points to graph. Therefore the number of months to retirement
    // should be exactly the same as the index of the second point for intersection, which is 
    // the first point where safe withdraw amount exceeds expenses.
    it('should have index of second intersection point equal to number of months', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        var second_point = val.points_for_intersection[1];
        var second_point_index = objectIndexOf(val.data_to_graph, second_point);
        
        expect(second_point_index).toBe(val.months);
    });
    
    function objectIndexOf(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            var cur_obj = arr[i];
            if (cur_obj.expenses == obj.expenses && cur_obj.withdraw_limit == obj.withdraw_limit) {
                return i;
            }
        }
        
        return -1;
    }
    
});