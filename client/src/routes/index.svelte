<script lang="ts">
	import axios from "axios";
	let totaltime = 0;
	let id = null;
	let haswon = 0;

	let wins = 0;
	let losses = 0;
	let draws = 0;

	import { onDestroy, onMount } from 'svelte';
	onMount(async()=>{
		id = localStorage.getItem('id');
		// localStorage.removeItem('id');
	})

	async function doFakeGet() {
		const record = {
			id: id
		};
		const res = await axios.post('http://localhost:8080/api/Record/a', record);
		// console.log(res);
		totaltime = res.data.time;
		wins = res.data.wins;
		losses = res.data.losses;
		draws = res.data.draws;
	}

	async function doPost() {
		CxCoption();
		const record = {
			time: time,
			id: id,
			haswon: haswon
		};
		const res = await axios.post('http://localhost:8080/api/Record', record);
		console.log(res.data.wins);
		if(id == null){		
		id = res.data;
		localStorage.setItem('id', id)
		}
		wins = res.data.wins;
		losses = res.data.losses;
		draws = res.data.draws;
		// console.log(id);
	}


	// from svelte tutorial
	import Timer from './Timer.svelte';
	let time = 0;
	const handleTick = () => (time += 1);

	let play;
	let playoptions;

	// bool keeping knowledge whether the player is supposed to play next
	let playermove = false;
	// bool keeping knowledge whether the player is playing with circles or crosses
	let playercross = false;
	let movecounter;
	let gamedone = false;

	interface BoardPiece {
		occupatedby: string;
		id: number;
	}

	let arr: BoardPiece[];

	// letting player to choose between crosses and circles
	const CxCoption = () => {
		play = false;
		playermove = false;
		playoptions = true;
		playercross = false;
		arr = Array(9)
			.fill(0)
			.map((_, i) => ({ occupatedby: '', id: i } as BoardPiece));
		// console.log(arr);
		arr = arr;
	};

	// creates board and moves / lets player to make the move
	const startgame = (event) => {
		gamedone = false;
		haswon = 0;
		play = true;
		movecounter = 1;
		if (event.target.innerHTML == 'crosses') {
			playermove = true;
			playercross = true;
		}
		playoptions = false;
		if (!playermove) {
			aiMove();
		}
	};


	//looking for all possible wins - it is quite "spaghettious" yet the easiest way
	function checkForWin() {
		if (
			(arr[0].occupatedby == arr[1].occupatedby &&
				arr[1].occupatedby == arr[2].occupatedby &&
				arr[0].occupatedby != '') ||
			(arr[3].occupatedby == arr[4].occupatedby &&
				arr[4].occupatedby == arr[5].occupatedby &&
				arr[3].occupatedby != '') ||
			(arr[6].occupatedby == arr[7].occupatedby &&
				arr[7].occupatedby == arr[8].occupatedby &&
				arr[6].occupatedby != '') ||
			(arr[0].occupatedby == arr[3].occupatedby &&
				arr[3].occupatedby == arr[6].occupatedby &&
				arr[0].occupatedby != '') ||
			(arr[1].occupatedby == arr[4].occupatedby &&
				arr[4].occupatedby == arr[7].occupatedby &&
				arr[1].occupatedby != '') ||
			(arr[2].occupatedby == arr[5].occupatedby &&
				arr[5].occupatedby == arr[8].occupatedby &&
				arr[2].occupatedby != '') ||
			(arr[0].occupatedby == arr[4].occupatedby &&
				arr[4].occupatedby == arr[8].occupatedby &&
				arr[0].occupatedby != '') ||
			(arr[2].occupatedby == arr[4].occupatedby &&
				arr[4].occupatedby == arr[6].occupatedby &&
				arr[2].occupatedby != '')
		) {
			gamedone = true;
			return true;
		}
		return false;
	}

	//looks at middle square if its free it plays there otherwise it just chooses randomly
	function aiMove() {
		if (arr[4].occupatedby == '') {
			playermove = true;
			if (!playercross) {
				arr[4].occupatedby = 'X';
			} else {
				arr[4].occupatedby = 'O';
			}

			return;
		} else {
			let rand = Math.floor(Math.random() * 8);
			while (arr[rand].occupatedby != '') {
				rand = Math.floor(Math.random() * 8);
			}

			arr[rand].occupatedby = playercross ? 'O' : 'X';
			playermove = true;
		}
		movecounter += 1;

		if (checkForWin()) {
			haswon = -1;
			alert('You have lost... Next game will be better!');
			return;
		}
		if (movecounter == 9) {
			gamedone = true;
			alert('You have Drawn... CG!!');
			return;
		}
	}

	const PlayerMove = (event) => {
		if (playercross) {
			changeToCross(event);
		} else {
			changeToCircle(event);
		}
		movecounter += 1;
		event.target.disabled = true;
		playermove = false;
		if (checkForWin()) {
			gamedone = true;
			haswon = 1;
			alert('You have won... CG!');
			return;
		}
		if (movecounter == 9) {
			gamedone = true;
			alert('You have Drawn... CG!!');
			return;
		}
		aiMove();
	};

	const changeToCircle = (event) => {
		arr[event.target.id].occupatedby = 'O';
	};

	const changeToCross = (event) => {
		arr[event.target.id].occupatedby = 'X';
	};
</script>

<body class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
	<h1 class="p-4 text-5xl font-serif text-center">Tic Tac Toe</h1>
	<hr class="border-t-4" />
	<div class="text-center p-7 rounded-2xl w-auto grid">
		<h1 class="p-6 m-6 text-5xl font-serif text-center">3×3</h1>
		<div class="rounded-full h-10 animate-bounce " class:hidden={playoptions || play}>
			<button
				on:click={CxCoption}
				class="rounded-full bg-purple-400 h-10 ease-linear transform hover:scale-125 transition duration-500 px-6 py-2 m-6 inline "
				>start playing!</button
			>
		</div>
		

		{#if playoptions}
			<p class="text-white text-4xl p-6 m-6">Play as:</p>
			<div class="w-1/2 grid grid-cols-3 grid-rows-1 place-self-center text-white">
				<div class="border-2 shadow-2xl rounded-2xl h-12">
					<button on:click={startgame} class="w-full h-full">circles</button>
				</div>

				<p class="text-white text-4xl">Or</p>

				<div class="border-2 shadow-2xl rounded-2xl h-12">
					<button on:click={startgame} class="w-full h-full">crosses</button>
				</div>
			</div>
		{/if}

		<div
			class="p-7 grid gap-4 grid-cols-3 grid-rows-3 rounded-3xl place-self-center"
			class:gameHolder={play}
			class:hidden={!play}
		>
			<!--the gameboard itself -->
			{#if play}
				{#key arr}
					{#each arr as a, i}
						<div class="border-2 shadow-2xl rounded-2xl w-24">
							<button
								id={String(i)}
								class="w-full text-white aspect-square"
								on:click={PlayerMove}
								disabled={arr[i].occupatedby != '' || gamedone}
							>
								{arr[i].occupatedby}
							</button>
						</div>
					{/each}
				{/key}
			{/if}
		</div>

		<button
			on:click={doPost}
			hidden={!gamedone || playoptions}
			class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-2 rounded-3xl w-64 place-self-center p-3 m-3"
			>Play another game</button
		>
	</div>
<br>
	<div class="grid grid-cols-1 grid-rows-2 w-full">
		<button on:click={doFakeGet} class="rounded-2xl bg-purple-400 h-10 w-1/3 place-self-center">What are my stats?</button>
		{#if totaltime != 0}
			<div class="place-self-center text-2xl text-yellow-200 border-2 p-6 m-2">
				YourID: {id} <br>
				Total time played: {totaltime} <br>
				Number of wins: {wins}<br>
				Number of losses: {losses}<br>
				Number of draws: {draws} 				
			</div>
		{/if}	
	</div>
	
 
	{#if !gamedone && play}
		<Timer callback={handleTick} />
	{/if}
</body>

<style type="postcss">
	.gameHolder {
		@apply bg-gradient-to-r from-pink-300 via-purple-500 to-indigo-300;
	}
</style>
