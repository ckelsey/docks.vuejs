class TestCase {
    name = `TestCase`
    val1 = 1
    val2 = 2

    asserts: Array<any> = [
        {
            name: `should add ${this.val1} plus ${this.val2} to equal 3`,
            fn: () => this.methods.add() === 3
        },
        "should subtract 2 from 1 to equal 1",
        "should fail"
    ]

    methods: { [key: string]: Function } = {
        add: () => this.val1 + this.val2,
        "should subtract 2 from 1 to equal 1": () => 2 - 1 === 1,
        "should fail": () => {
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    return reject(`oops`)
                }, 1000)
            })
        }
    }
}

class TestCase2 {
    name = `TestCase2`
    val = 1

    asserts: Array<any> = [
        {
            name: `1 equals ${this.val}`,
            fn: () => {
                return 1 === this.val
            }
        }
    ]
}

class Tests {
    name = 'Demo'

    tests = [
        new TestCase(),
        new TestCase2()
    ]
}

export default new Tests()