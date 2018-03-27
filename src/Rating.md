### Rating control with default props:

```js
<Rating />
```

### onClick handler

```js 
initialState = { val: 3 }
;<Rating
value={state.val}
onClick={val => setState({val:val})}/>
```

### Min, max and current value

```js 
initialState = { val: 7 }
;<Rating
value={state.val}
min={5}
max={10}
onClick={val => setState({val:val})}/>
```

### Width, height, radius and distance

You can use static functions `Rating.optimalWidth(min, max, radius, distance)` and
 `Rating.optimalHeight(radius)` to obtain optimal width and height.

```js 
initialState = { val: 1 }
;<Rating
radius={45}
distance={15}
min={1}
max={3}
value={state.val} 
width={Rating.optimalWidth(1, 3, 45, 15)}
height={Rating.optimalHeight(45)}
onClick={val => setState({val:val})}/>
```


### Colors


```js 
initialState = { val: 7 }
;<Rating
  value={state.val}
  min={5}
  max={10}
  onClick={val => setState({val:val})}
  circleColor='white'
  selCircleColor='black'
  textColor='darkgray'
  selTextColor='white'
  />
```

### Text

Text is optional.

```js
initialState = { val: 2 }
;<Rating
  displayText={false}
  value={state.val}
  min={1}
  max={5}
  onClick={val => setState({val:val})} />
```

```js
initialState = { val: 2 }
;<Rating
  displayText={false}
  value={state.val}
  min={1}
  max={5}
  onClick={val => setState({val:val})} 
  circleColor='lightgray'
  selCircleColor='black'
  displayText={false}
  radius={5}
  distance={10} />
```