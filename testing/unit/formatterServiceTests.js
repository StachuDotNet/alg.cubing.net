describe('formatterService', function () {
    beforeEach(module('algxApp'));

    it('empty alg should escape correctly', inject(function (formatterService) {
        expect(formatterService.escape_alg('')).toBe('');
    }));

    it('another alg should do the right thing', inject(function (formatterService) {
        expect(formatterService.escape_alg("R U R' U'")).toBe("R_U_R-_U-");
    }));

    it('should escape an alg appropriately', inject(function () {
        expect('').toBe('');
    }));
});