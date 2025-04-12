'use strict';

//DATA
const account1 = {
  owner: 'Yash Joshi',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, //%
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Divyansh Singh',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5, //%
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Ashish Sharma',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7, //%
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Rahul Sharma',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1, //%
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

//ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//functions
const displayMovements = function (movements, sort = false) {
  //for clearing the container
  containerMovements.innerHTML = '';
  //or .textContent = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; //we use slice op to make a copy coz sort mutate the array so we create a copy then use sort

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}Rs</div>
    </div>`;

    //to display the transactions(by insertAdjacentHTML) in a certai order(like afterbegin)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//display balance
const displayBalance = function (act) {
  act.balance = act.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${act.balance}Rs`;
};

//Display summary
const displaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income}Rs`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}Rs`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}Rs`;
};

//create username
const createUsername = function (accs) {
  //we add username property in the account array not create new array so use forEach
  accs.forEach(function (acc) {
    //add username
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);
// console.log(accounts);

//UI update
const updateUI = function (currentAccount) {
  //Display movements
  displayMovements(currentAccount.movements);

  //Display balance
  displayBalance(currentAccount); //we pass whole array to add balance property in the array

  //Display Summary
  displaySummary(currentAccount); //we pass whole array to use multiple values like movements, interest rate
};

//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevent from form submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1; //0 = hide, 1 = show

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //to remove cursor from pin after login
    inputLoginPin.blur();

    //update ui
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //remove fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    recieverAcc &&
    recieverAcc.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    //update ui
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= (amount * 10) / 100)
  ) {
    //add movement
    currentAccount.movements.push(amount);

    //update ui
    updateUI(currentAccount);
  }
  //remove field
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);

    //delete acc
    accounts.splice(index, 1);

    //hide ui
    containerApp.style.opacity = 0;
  }

  //remove fields
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, sorted);
  sorted = !sorted;
});

///////////////////////////////////////////
///////////////////////////////////////
//Array methods
let arr = ['a', 'b', 'c', 'd', 'e'];
/*

//SLICE - it does not change original array, it gives new array
console.log(arr.slice(2));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(0, 2));
console.log(arr.slice(1, -1));

console.log(arr.slice());
//or
console.log([...arr]);

//SPLICE- it changes the original array, it is used to delete multiple elements, it mutate the array
// console.log(arr.splice(2));
arr.splice(1, 2); //from position 1 2 elements are deletes
console.log(arr);

//REVERSE- (it also mutate the array or it change the original array)
const arr2 = ['f', 's', 'i', 'j', 'k'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT- (it does notmutate the array)
arr = ['a', 'b', 'c', 'd', 'e'];
const letters = arr.concat(arr2);
console.log(letters);
//or
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join('-'));

//AT
const num = [11, 32, 64, 89];
console.log(num[0]);
//or
console.log(num.at(0));

//to access last element
console.log(num[num.length - 1]);
//or
console.log(num.slice(-1)[0]);
//or
console.log(num.at(-1));

//it is also valid on  string
console.log('yash'.at(0));
console.log('yash'.at(-1));
*/

//for each
/*
const movements = [400, 600, -350, 800, -200, 1500];

// for (const movement of movements)
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdraw ${Math.abs(movement)}`);
  }
}

//or by forEach
movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdraw ${Math.abs(movement)}`);
  }
});


//forEach in map or set
//map
const currencies = new Map([
  ['USD', 'United States Dollar'],
  ['EUR', 'Euro'],
  ['RUP', 'Rupees'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//set
const newCurrencies = new Set(['USD', 'EUR', 'USD', 'RUP', 'RUP']);
console.log(newCurrencies);

newCurrencies.forEach(function (value, _, set) { // _(undderscore) os a throwaway var or unnecessary variable
  console.log(`${value}`);
});
*/

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
///////////////////////SOLUTION////////////////
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice(); //for coping whole array

  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  // console.log(dogsJuliaCorrected);

  // const dogs = [...dogsJuliaCorrected, ...dogsKate]; or
  const dogs = dogsJuliaCorrected.concat(dogsKate);

  dogs.forEach(function (age, i) {
    if (age >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  });
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/

/*
//Map method
const movements = [400, 600, -350, 800, -200, 1500];

// const movmentsUSD = movements.map(function (mov) {
//   return mov * 1.1;
// });
//by using arrow fn
const movementsUSDArrow = movements.map(mov => mov * 1.1);

console.log(movements);
console.log(movementsUSDArrow);

//we can also do this by using for loop
const movmentsUSDfor = [];
for (const mov of movements) movmentsUSDfor.push(mov * 1.1);

console.log(movmentsUSDfor);

//example
const movDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movDescription);
*/

/*
//Filter method
const movements = [400, 600, -350, 800, -200, 1500];

const deposit = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposit);

//using for loop
const depositFor = [];
for (const mov of movements) {
  if (mov > 0) depositFor.push(mov);
}
console.log(depositFor);

//withdrawl
const withdraw = movements.filter(mov => mov < 0);
console.log(withdraw);
*/

/*
//Reduce method
const movements = [400, 600, -350, 800, -200, 1500];

//acc= accumulator - snowball(here add value one by one)
const balance = movements.reduce(function (acc, curr, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + curr;
}, 0); //0 is starting val of accumulator
console.log(balance);

//using arrow fun
const balanceArrow = movements.reduce((acc, curr) => acc + curr, 0);
console.log(balanceArrow);

//usinf for loop
let balanceFor = 0;
for (const curr of movements) balanceFor += curr;
console.log(balanceFor);

//findinf maximum
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov; //it will save in acc
}, movements[0]);
console.log(max);
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
////////////////////////SOLUTION///////////////
const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  // console.log(humanAge);

  const adultAge = humanAge.filter(age => age >= 18);
  // console.log(adultAge);

  const avgAge = adultAge.reduce((acc, age) => acc + age, 0);
  // console.log(avgAge);

  const avg = avgAge / adultAge.length;
  console.log(avg);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
*/

/*
// The Magic of Chaining Methods
const movements = [400, 600, -350, 800, -200, 1500];
const eurToUsd = 1.1;
console.log(movements);

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  // .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);
*/

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
////////////////SOLUTION//////////////////////
const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const age1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const age2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(age1, age2);
*/

/*
//Find method
const movements = [400, 600, -350, 800, -200, 1500];

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

//example
console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Yash Joshi');
console.log(account);
*/

/*
//findLastIndex and findLast method
const movements = [400, 600, -350, 800, -200, 1500];
console.log(movements);

const lastWithdrawal = movements.findLast(mov => mov < 0);
console.log(lastWithdrawal);

const latestIndex = movements.findLastIndex(mov => mov > 1000);
console.log(latestIndex);

//some method
const anyDeposit = movements.some(mov => mov > 0);
console.log(anyDeposit);

//every method
console.log(movements.every(mov => mov > 0));
console.log([1, 2, 3, 4, 5].every(mov => mov > 0));

//we can also use callback seprately
const deposit = mov => mov > 0;
console.log(movements.filter(deposit));
console.log(movements.some(deposit));
console.log(movements.every(deposit));
*/

/*
//flat and flatMap method
const array = [[1, 2, 3], [4, 5, 6], 7, 8];
// const [x, y, ...z] = array;
// console.log([...x, ...y, ...z]);
console.log(array.flat());

const array2 = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(array2.flat(2));

const balance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(balance);

//flatMap - using flat and map combinely
const balance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(balance2);
*/

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];
*/

/*
/////////////////////SOLUTION//////////////////
//1
const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
console.log(huskyWeight);

//2
const dogBothActivities = breeds.find(
  breed =>
    breed.activities.includes('running') && breed.activities.includes('fetch')
).breed;
console.log(dogBothActivities);

//3
// const allActivities = breeds.map(breed => breed.activities).flat();
const allActivities = breeds.flatMap(breed => breed.activities);
console.log(allActivities);

//4
const uniqueActivities = new Set(allActivities);
console.log([...uniqueActivities]);

//5
const swimmingAdjacent = new Set(
  breeds
    .filter(breed => breed.activities.includes('swimming'))
    .flatMap(breed => breed.activities)
    .filter(breed => breed !== 'swimming')
);
console.log([...swimmingAdjacent]);

//6
console.log(breeds.every(breed => breed.averageWeight >= 10));

//7
console.log(breeds.some(breed => breed.activities.length >= 3));

//bonus
const fetchWeights = breeds
  .filter(breed => breed.activities.includes('fetch'))
  .map(breed => breed.averageWeight);
console.log(fetchWeights);

const maxWeight = Math.max(...fetchWeights);
console.log(maxWeight);
*/

/*
//sort arrays
//it will mutate/change original array
//string
const owners = ['yash', 'ashish', 'rahul', 'divyansh'];
console.log(owners.sort());
console.log(owners);

//numbers
//return < 0 -> A,B (keep order)
//return > 0 -> B,A (Swap order)
const movements = [400, 600, -350, 800, -200, 1500];

//ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

//descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

/*
//array grouping
const movements = [400, 600, -350, 800, -200, 1500];
console.log(movements);

const groupMovements = Object.groupBy(movements, mov =>
  mov > 0 ? 'Deposit' : 'Withdrawal'
);
console.log(groupMovements);

//example
const groupByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';
  if (movementCount >= 5) return 'active';
  if (movementCount >= 2) return 'moderate';
  return 'inactive';
});
console.log(groupByActivity);

//example
// const groupAccounts = Object.groupBy(accounts, account => account.type);
//or
const groupAccounts = Object.groupBy(accounts, ({ type }) => type);
console.log(groupAccounts);
*/

/*
//fill method
const x = new Array(7);
console.log(x); //empty array

// x.fill(1, 3);
// x.fill(1, 3, 5);
x.fill(1);
console.log(x);

const array = [2, 4, 6, 9];
console.log(array.fill(26, 1, 3));

//from method
const y = Array.from({ length: 7 }, () => 2);
console.log(y);

const z = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(z);

//example- generate 100 random dice no
const dice = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 6) + 1
);
console.log(dice);

//use from method to display movements from bankist app in array
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('Rs', ''))
  );

  console.log(movementsUI);
});
*/

/*
///////////////////////////////////////
// Non-Destructive Alternatives: toReversed, toSorted, toSpliced, with
const movements = [400, 600, -350, 800, -200, 1500];

//we can also do using slice-
// const newMoves = movements.slice().reverse();

const newMove = movements.toReversed();

console.log(movements);
console.log(newMove);

//with
// movements[1] = 2000;
console.log(movements);

//but change not in original array-
const newMovement = movements.with(1, 2000);
console.log(newMovement);
*/

/*
///////////////////////////////////////
// Array Methods Practice

//1
const bankDeposit = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, curr) => acc + curr, 0);
console.log(bankDeposit);

//2
// const numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

//or
const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, curr) => (curr >= 1000 ? count + 1 : count), 0);
console.log(numDeposit1000);

//3
const { deposit, withdrawal } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, curr) => {
      // curr > 0 ? (sum.deposit += curr) : (sum.withdrawal += curr);
      //or
      sum[curr > 0 ? 'deposit' : 'withdrawal'] += curr;
      return sum; //we return here coz in this ex there is a curly braces so we explicitly retutn
    },
    { deposit: 0, withdrawal: 0 }
  );
console.log(deposit, withdrawal);

//4
//this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const expextions = ['a', 'an', 'the', 'and', 'but', 'or', 'on', 'in', 'with'];

  const capitalize = str => str[0].toUpperCase() + str.slice(1); //it capitalize first letter od string

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (expextions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/

///////////////////////////////////////
// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

GOOD LUCK 😀
*/

/*
///////////////////SOLUTION///////////////////

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1
dogs.forEach(dog => (dog.recFood = Math.floor(dog.weight ** 0.75 * 28)));
console.log(dogs);

//2
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(`Sarah's dog eating too ${
  dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
}
  `);

//3
const ownersTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);

const ownersTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);

console.log(ownersTooMuch);
console.log(ownersTooLittle);

//4
console.log(`${ownersTooMuch.join(' and ')}'s dogs are eating too much!`);
console.log(`${ownersTooLittle.join(' and ')}'s dogs are eating too little!`);

//5
console.log(dogs.some(dog => dog.curFood === dog.recFood));

//6
const checkEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.every(checkEatingOkay));

//7
const dogEatingOkay = dogs.filter(checkEatingOkay);
console.log(dogEatingOkay);

//8
const dogsGroupedByPortion = Object.groupBy(dogs, dog => {
  if (dog.curFood > dog.recFood) return 'too-much';
  else if (dog.curFood < dog.recFood) return 'too-little';
  else return 'exact';
});
console.log(dogsGroupedByPortion);

//9
const dogsGroupedByOwners = Object.groupBy(
  dogs,
  dog => `${dog.owners.length}-owners`
);
console.log(dogsGroupedByOwners);

//10
const dogSorted = dogs.toSorted((a, b) => a.recFood - b.recFood);
console.log(dogSorted);
*/
