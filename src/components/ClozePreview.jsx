import React, { useEffect, useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ClozePreview({ question, onChange }) {
  const { questionText = "", underlinedWords = [] } = question || {};

  const initialBlanks = useMemo(() => {
    const blanks = {};
    underlinedWords.forEach(({ key }) => {
      blanks[key] = null;
    });
    return blanks;
  }, [underlinedWords]);

  const [blanks, setBlanks] = useState(initialBlanks);

  useEffect(() => {
    setBlanks(initialBlanks);
  }, [initialBlanks]);

  const updateBlanks = (newBlanks) => {
    setBlanks(newBlanks);
    if (onChange) onChange(newBlanks);
  };

  const assignedWords = Object.values(blanks).filter(Boolean);
  const availableOptions = underlinedWords.filter(
    ({ word }) => !assignedWords.includes(word)
  );

  const words = questionText.trim().split(/\s+/);

  const isUnderlined = (word, idx) =>
    underlinedWords.some(({ key }) => key === `${word}__${idx}`);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId === "options") {
      if (source.droppableId !== "options") {
        updateBlanks({ ...blanks, [source.droppableId]: null });
      }
      return;
    }

    if (destination.droppableId !== "options") {
      if (source.droppableId === "options") {
        if (Object.values(blanks).includes(draggableId)) return;

        const updated = { ...blanks, [destination.droppableId]: draggableId };
        updateBlanks(updated);
        return;
      }

      if (source.droppableId !== "options") {
        const sourceWord = blanks[source.droppableId];
        const destWord = blanks[destination.droppableId];

        const updated = { ...blanks };
        updated[source.droppableId] = destWord || null;
        updated[destination.droppableId] = sourceWord;

        updateBlanks(updated);
        return;
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="mb-8 text-lg leading-relaxed flex flex-wrap gap-2 select-text">
          {words.map((word, idx) => {
            const key = `${word}__${idx}`;
            if (isUnderlined(word, idx)) {
              return (
                <Droppable key={key} droppableId={key} direction="horizontal">
                  {(provided, snapshot) => (
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`inline-flex justify-center items-center w-28 min-h-[2.25rem] mx-1 px-3 border-b-4 border-indigo-600
                        rounded-lg select-none font-semibold text-indigo-700 tracking-wide
                        transition-colors duration-300 ease-in-out
                        ${
                          snapshot.isDraggingOver
                            ? "bg-indigo-200 shadow-lg"
                            : "bg-indigo-50"
                        }`}
                    >
                      {blanks[key] ? (
                        <Draggable draggableId={blanks[key]} index={0} key={blanks[key]}>
                          {(provided, snapshot) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`inline-block cursor-move select-none
                                rounded-md px-4 py-1 shadow-md
                                transition-transform duration-300 ease-in-out
                                ${
                                  snapshot.isDragging
                                    ? "bg-indigo-400 text-indigo-900 scale-110 shadow-xl"
                                    : "bg-indigo-700 text-white"
                                }`}
                            >
                              {blanks[key]}
                            </span>
                          )}
                        </Draggable>
                      ) : (
                        <div className="w-full h-6" />
                      )}
                      {provided.placeholder}
                    </span>
                  )}
                </Droppable>
              );
            }
            return (
              <span
                key={idx}
                className="mr-2 mb-1 text-gray-800 select-text whitespace-nowrap"
              >
                {word}
              </span>
            );
          })}
        </div>

        <Droppable droppableId="options" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className={`flex flex-wrap gap-3 p-4 border-2 rounded-2xl bg-indigo-50 min-h-[4rem]
                justify-start items-center
                transition-colors duration-300 ease-in-out
                ${snapshot.isDraggingOver ? "bg-indigo-100 border-indigo-400" : "border-indigo-200"}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {availableOptions.length === 0 && (
                <span className="text-gray-400 select-none italic">All options placed</span>
              )}
              {availableOptions.map(({ key, word }, index) => (
                <Draggable key={key} draggableId={word} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-indigo-700 text-white px-5 py-2 rounded-lg cursor-move select-none shadow-md
                        transition-transform duration-300 ease-in-out
                        ${
                          snapshot.isDragging
                            ? "bg-indigo-900 scale-110 shadow-xl"
                            : "hover:bg-indigo-800"
                        }`}
                    >
                      {word}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
