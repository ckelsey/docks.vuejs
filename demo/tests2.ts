import TestService from './service'

class TestCase{
    name = `TestService`
    for = `doAddition`
    asserts = [
        {
            name: `doAddition`,
            fn: () => TestService.doAddition(1,2) === 3
        }
    ]
}

class Tests {
    name = 'TestService'

    for = TestService

    tests = [
        new TestCase()
    ]
}

export default new Tests()