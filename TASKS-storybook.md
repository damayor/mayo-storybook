# Storybook Tasks — WebXR Hello World

> This file is scoped exclusively to the Storybook setup (`mayo-storybook`). Do **not** touch the portfolio pages, components, or routing. All new files live under `src/stories/`

## Task 1
[] Add an intro page to my storybook, el mejor ejemplo es https://designlanguage.adidas.com/?path=/docs/welcome--documentation

## Task 2
[] Plase hide the controls panel on all the stories that do not have any parameter in the story

# task 3
Add this in this context, I dont know if in MayoCanvas but I wanna that I can print the camera props in Chrome console.
/**
 * SceneHelpers to provide more information in 3D Canvas
 * - Blue grid at world origin (0, 0, 0) - reference grid for the entire scene 
 * - Pink/Red grid at the orbitTarget - the new origin for orbit controls, configurable from tenant config 
 */
export function SceneHelpers({orbitTarget} : { orbitTarget :[number, number, number] }) {

  /* For Debugging in Console*/
  useThree(({ camera, controls }) => {
    // @ts-ignore
    window.cam = camera;

    // @ts-ignore
    window.controls = controls;
  });

  return (
  )

}"

---

## Notes for Claude

- Run `pnpm storybook` after each subtask to confirm no regressions.
