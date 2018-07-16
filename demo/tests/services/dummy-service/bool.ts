import dummy from "../../../../src/dummy-service";

class Bool {
    name = `bool`
    asserts = [
        {
            name: `should be true`,
            fn: () => {
                return dummy.bool
            }
        }
    ]
}

export default new Bool()