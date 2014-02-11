window.onload = function(){
	
	//Init variables
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
	const w = canvas.offsetHeight;		//Width of canvas
	const h = canvas.offsetHeight;		//Heihgt of canvas
	const BOXSIZE = 20;						//Size of the grid the snake is snapped to
	
	var snake; 									//Holds the snake as an array
	var snake_direction = "right";		//Direction the snake is moving
	var food;									//Holds the food as an object
	var score;									//Player score

	//Main
	newGame();
	setInterval(mainloop, 80);

	function mainloop()
	{
		logic();
		update();
		paint();	
	}
	
	function logic()
	{
		//Get keyboard input
		document.onkeydown = function(e)
		{
			var key = e.which;
			if(	  key == "37" 	&&  snake_direction != "right") snake_direction = "left";		
			else if(key == "38" 	&&  snake_direction != "down") snake_direction = "up";		
			else if(key == "39" 	&&  snake_direction != "left") snake_direction = "right";		
			else if(key == "40" 	&&  snake_direction != "up") snake_direction = "down";		
		};	
		
		//Game over scenario
		var sx = snake[0].x;
		var sy = snake[0].y;
		
		//Snake out of bounds
		if(sx < 0 || sx >= w / BOXSIZE || sy < 0 || sy >= h / BOXSIZE || checkCollision(sx, sy))
		{
			newGame();
			return;
		}
	}
	
	function update()
	{	
		var sx = snake[0].x;
		var sy = snake[0].y;
		
		//Update direction
		switch(snake_direction)
		{
			case "right": 	sx++;	break;
			case "left":  	sx--;	break;
			case "down":  	sy++;	break;
			case "up": 		sy--; break;
			default: sx++;					
		}	
		
		//Snake Eat
		if(sx == food.x && sy == food.y)
		{		
			newFood();		
			score += 100;	
		}
		
		//Update snake position if not eatting
		else
		{			
			snake.pop();	
		}
		var tail = {x:sx, y:sy};
		snake.unshift(tail);		
	}
	
	function paint()
	{
		//Paint BG
		context.fillStyle = "black";
		context.fillRect(0,0,w,h);
	
		//Paint Snake
		for(var i = 0; i < snake.length; i++)
		{
			paintBox(snake[i].x, snake[i].y);
		}
		
		//Paint Food
		paintBox(food.x, food.y);
		
		//Paint Score
		context.fillStyle="#8080ff";
		context.font = '15pt Arial';
		context.fillText("Score: " + score, 5, h - 5);
	}
		
	//Extras
	function checkCollision(x,y)
	{
		for(var i = 1; i < snake.length; i++)
		{
			if(x == snake[i].x && y == snake[i].y)
				return true;
		}
		return false;
	}
	
	function paintBox(x, y)
	{
		var grd = context.createRadialGradient((BOXSIZE * x), (BOXSIZE * y), 0, (BOXSIZE * x), (BOXSIZE * y), BOXSIZE);

      grd.addColorStop(0, '#404080');
      grd.addColorStop(1, '#202040');

      context.fillStyle = grd;
		context.fillRect(x * BOXSIZE, y * BOXSIZE, BOXSIZE, BOXSIZE);
		context.strokeStyle="#8080ff";
		context.strokeRect(x * BOXSIZE, y * BOXSIZE, BOXSIZE, BOXSIZE);
	}
	
	function newGame()
	{
		newSnake();
		newFood();
		score = 0;
	}	
	
	function newFood()
	{
		do
		{
			food = {
				x: Math.round(Math.random() * (w - BOXSIZE) / BOXSIZE),
				y: Math.round(Math.random() * (h - BOXSIZE) / BOXSIZE)
			}
		}
		while(checkCollision(food.x, food.y));
	}	
	
	function newSnake()
	{
		snake_direction = "right";
		snake = [];
		
		for(var i = 5 - 1; i >=0; i--)
			snake.push({x:i,y:0});
	}
}