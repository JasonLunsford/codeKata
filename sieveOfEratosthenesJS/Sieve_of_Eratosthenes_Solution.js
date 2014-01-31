/*
	Sieve of Eratosthenes
	Problem: Reproduce famous algorithm for discovering prime numbers in a fixed set. 
	http://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
*/
var sieve = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];

for ( var i = 2; i <= sieve.length+1; i++ ) {
	for ( var j = 0; j < sieve.length; j++ ) {
	   if ( sieve[j] % i == 0 && sieve[j] - i != 0 ) {
	       sieve.splice(j, 1);
	   }
	}
}

console.log ( sieve );