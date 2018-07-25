import bool from './bool'
import dummyService from '../../../../src/dummy-service';

class DummyService{
    name = `DummyService`
    for = dummyService
    tests = [
        bool
    ]
}

export default new DummyService()