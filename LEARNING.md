# Getting Started on Mac

1. Open XCode
2. Go to Settings -> Platform -> Download iOS
3. Open Simulator app and create new iPhone simulator
4. File -> Open Simulator
5. `npx expo start` and pres `i`


# Gotchas

https://reactnative.dev/docs/scrollview
> Keep in mind that ScrollViews must have a bounded height in order to work, since they contain unbounded-height children into a bounded container (via a scroll interaction). In order to bound the height of a ScrollView, either set the height of the view directly (discouraged) or make sure all parent views have bounded height. Forgetting to transfer {flex: 1} down the view stack can lead to errors here, which the element inspector makes quick to debug.

# Icons

https://pictogrammers.com/library/mdi/

# Development Builds

- A development build is a debug build. It can be used instead of Expo Go. With this you gain full control over the native runtime to install native libraries, modify any project configuration, or write your own native code. 
- Development builds take as long as other builds to run. (woo :( )
