# Memory Tests

The examples in this folder demonstrates memory-related aspects of SciChart.js functionality.  
They could be used for testing and debugging different SciChart features.

## Understanding the setup and functionality

Make sure to check the related documentation:  
[Memory Best Practices](https://www.scichart.com/documentation/js/current/webframe.html#MemoryBestPractices.html)  
[Memory Leak Debugging](https://www.scichart.com/documentation/js/current/webframe.html#MemoryLeakDebugging.html)  
[Memory Management Cheat Sheet](./MemoryManagementCheatSheet.md)

## Performing debugging

Depending on the use-case select one of the provided examples.  
Follow the instructions in the example and recommendations on memory profiling.

- [Chart Initialization and Cleanup](./ChartInitializationAndCleanup/Readme.md)
- [Dynamic Data Updates](./DataUpdates/Readme.md)
- [Dynamic FIFO Data Updates](./FifoSeries/Readme.md)

## Reporting an issue

If you suspect there is a memory related issue in SciChart.js,  
please use one of this examples to verify the problem.  
Or modify them with minimum of necessary changes to reproduce.

Alternatively you can serialize a chart and send the config to us:
[Serialization and Deserialization of Charts](https://www.scichart.com/documentation/js/current/webframe.html#Serialization%20and%20Deserialization%20of%20Charts.html)

Additionally you can serialize and share the Memory and Performance debug logs.

Then share this example or config with us as well as steps to reproduce and some info such as:

- functional and non functional requirements
- environment details
