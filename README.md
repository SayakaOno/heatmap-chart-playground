# Heatmap color playground
![heatmap-color-playground-main](https://user-images.githubusercontent.com/33141219/188217661-f6896aa1-34b5-4580-8a43-fa8481b96093.png)<br />
Heatmap color playground is a React application that helps you experiment heatmap color.<br />
Please try it out [here](https://sayakaono.github.io/heatmap-color-playground/)!

## Features
- **History (Capture functionality)**<br />
Users can compare different colors and ranges within the app and make decisions easily.
- **Show numbers on heatmap**<br />
![show-numbers](https://user-images.githubusercontent.com/33141219/188223642-c8f722f8-4b51-4472-8dbc-a10153215ad3.png)
Users can show numbers on heatmap so that they can understand what number is mapped to which color.

### Tool1
**Generates a gradient by selecting a color from the pallet or specifying a hex value.**<br />

![tool1](https://user-images.githubusercontent.com/33141219/188223377-6053f11d-e2a9-45da-9597-d12a29dd55a7.gif)
- Users can specify a range(3 - 10) in case they want to use a specific range of colors.
- The color picker helps users specify a hex value.


### Tool2
**Generates a gradient by specifying RGBs as gradient points.**
![tool2](https://user-images.githubusercontent.com/33141219/188221460-370cfefc-b1cd-47fa-954e-cf1114e21dca.gif)
- Users can decide on the number of gradient points they want to use.
- Users can use the color picker to provide RGBs.

## Specification
Create React App<br />

Libraries:
- [Ant Design](https://github.com/ant-design/ant-design)
- [html2canvas](https://github.com/niklasvh/html2canvas)
- [react-colorful](https://github.com/omgovich/react-colorful)
- [W3Color JavaScript Library](https://www.w3schools.com/lib/w3color.js)<br />

Reference:
- [Code - heatmaps and color gradients](https://www.andrewnoske.com/wiki/Code_-_heatmaps_and_color_gradients)