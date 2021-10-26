# Inverse Hyperbolic Sine transform by Custom Filter

The Inverse Hyperbolic Sine is an approximation to the natural logarithm, which is well behaved at zero.  It is often used in economics for analysing data based on nominal wealth, which can be very large, but also zero or even negative.  See https://www.themsp.org/2017/10/01/visualizing-racial-wealth-gaps/ for an example.

Here we use a simple custom filter to apply the IHS transformation, rather than use a log axis.

## Running the Example

To run the tutorial, open this folder in VSCode, and run the following commands:

* `npm install`
* `npm start`

Then visit https://localhost:8080 in your web browser!


## How it works

```typescript
const ihsFilter = new XyCustomFilter(dataSeries, { filterFunction: ((i, y) => Math.log(y + Math.sqrt(1 + y*y))) });
```
