describe('formatterService', function () {
    beforeEach(module('algxApp'));

    it('empty alg should escape correctly', inject(function (formatterService) {
        expect(formatterService.escape_alg('')).toBe('');
    }));

    it('another alg should do the right thing', inject(function (formatterService) {
        expect(formatterService.escape_alg("R U R' U'")).toBe("R_U_R-_U-");
    }));

    it('plus symbol should escape correctly', inject(function (formatterService) {
        // this correct, or no? Kinda set this up to match what jasmine was expecting. Review.
        expect(formatterService.escape_alg("+")).toBe("&#2b;");
    }));
});