//  const state = reactive({
//    name: 'perfectyang',
//    time: 1
//  })
//  const count = computed({
//    getter: () => {
//      return state.time
//    },
//    setter: (value) => {
//      state.time = value
//    }
//  })
// const vf = ref(1)
// effect(() => {
//   console.log('eeee--->', vf.value)
//   document.getElementById('txt').innerHTML = vf.value
// })
// document.getElementById('btn').onclick = function () {
//   vf.value++
// }
// document.getElementById('btn2').onclick = function () {
//   state.name = '我变了'
// })
type User = {
  key: string;
};

const user: User & { value: string } = {
  key: "h2ll",
  value: "h",
};
console.log("user.", user.key);

interface RunFn {
  (params: [number, string]): string;
}

const fn: RunFn = (params) => {
  return params[1];
};

fn([1, "aa"]);
