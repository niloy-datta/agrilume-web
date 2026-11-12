import { createXRStore } from "@react-three/xr";

/**
 * One XR store for the page. We offer our own "Enter VR" button (offerSession: false), turn the dev-machine headset
 * emulator off, and give both controllers and tracked hands a teleport ray so people can walk around the field.
 */
export function createStore() {
  return createXRStore({
    emulate: false,
    offerSession: false,
    controller: { teleportPointer: true },
    hand: { teleportPointer: true },
    foveation: 0.3,
    frameRate: "high",
  });
}
