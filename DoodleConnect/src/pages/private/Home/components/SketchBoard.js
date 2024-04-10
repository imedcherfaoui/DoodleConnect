import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View, Modal } from "react-native";
import { Canvas } from "@benjeau/react-native-draw";
import { addDoc, collection, onSnapshot, getDocs } from "firebase/firestore";
import {
  FIREBASE_AUTH,
  FIREBASE_DB,
} from "../../../../../firebase/firebaseConfig";

function SketchBoard() {
  const canvasRef = useRef(null);
  const [drawingPaths, setDrawingPaths] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(FIREBASE_DB, "drawings"),
      (snapshot) => {
        const drawingData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrawingPaths(drawingData);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPathsToCanvas = () => {
    drawingPaths.forEach((drawing) => {
      drawing.paths.forEach((path) => {
        canvasRef.current?.addPath({
          color: path.color,
          thickness: path.thickness,
          opacity: path.opacity,
          data: path.data ? path.data.map((data) => JSON.parse(data)) : [],
          path: path.path ? path.path.map(JSON.parse) : [],
        });
      });
    });
  };

  // Mettre à jour le canvas à chaque changement de drawingPaths
  useEffect(() => {
    addPathsToCanvas();
  }, [drawingPaths]);

  const handleSaveDrawing = async () => {
    const paths = canvasRef.current?.getPaths();
    console.log(paths);
    if (paths && paths.length > 0) {
      try {
        const formattedPaths = paths.map((path, index) => {
          const formattedPath = {
            id: index.toString(),
            color: path.color,
            combine: path.combine,
            opacity: path.opacity,
            thickness: path.thickness,
          };
          // Convert data array to string before saving
          if (path.data) {
            formattedPath.data = path.data.map((data) => JSON.stringify(data));
          }
          // Convert path array to string before saving
          if (path.path) {
            formattedPath.path = path.path.map(JSON.stringify);
          }
          return formattedPath;
        });

        // Save formatted drawing paths to Firestore
        await addDoc(collection(FIREBASE_DB, "drawings"), {
          paths: formattedPaths,
          userId: FIREBASE_AUTH.currentUser.uid,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error saving drawing:", error);
      }
    }
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  const onSelectColor = ({ hex }) => {
    // do something with the selected color.
    setCurrentColor(hex);
  };

  console.log("drawingPaths", drawingPaths);
  console.log("canvasRef", canvasRef);

  return (
    <View style={styles.container}>
      <Canvas
        ref={canvasRef}
        height={400}
        color="red"
        thickness={20}
        opacity={0.6}
        style={{ backgroundColor: "lightgray" }}
      />
      <Button title="Undo" onPress={handleUndo} />
      <Button title="Save" onPress={handleSaveDrawing} />
      <Button title="Clear" onPress={handleClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SketchBoard;
