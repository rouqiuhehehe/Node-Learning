import chai from 'chai';
import User from '../src/models/user';

const { expect } = chai;

describe('Array', () => {
    describe('#save()', () => {
        it('should save whthout error', async () => {
            const user = new User({
                username: 'dsc',
                password: 'dsaadsa'
            });
            try {
                const res = await user.save();
                expect(res).to.be.a('number');
                // done();
            } catch (e) {
                throw new Error(e);
            }
            // expect([1, 2, 3]).to.not.include(4);
        });
    });
});
