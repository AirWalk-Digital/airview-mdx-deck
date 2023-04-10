import React, { useEffect, useRef } from 'react';

const MermaidDiagram = ({ children }) => {
  const diagramRef = useRef();

  useEffect(() => {
    const renderDiagram = async () => {
      await window.mermaid.init(undefined, diagramRef.current);
      console.log('MermaidDiagram:children: ', children)
      window.mermaid.mermaidAPI.render('mermaid-diagram', children.props.children.toString(), (svgCode) => {
        diagramRef.current.innerHTML = svgCode;
      });
    };

    if (typeof window !== 'undefined') {
      renderDiagram();
    }
  }, [children]);

  return (
    <div ref={diagramRef} className="mermaid"></div>
  );
};



export { MermaidDiagram };
