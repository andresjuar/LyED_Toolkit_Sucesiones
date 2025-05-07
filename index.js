function procesar() {
    const formula = document.getElementById('formula').value.trim();
    const m = parseInt(document.getElementById('min').value);
    const n = parseInt(document.getElementById('max').value);
    const resultadosDiv = document.getElementById('resultados');
    const sucesion = [];

    resultadosDiv.innerHTML = ''; // Limpiar resultados previos

    if (!formula || isNaN(m) || isNaN(n) || m > n) {
      resultadosDiv.innerHTML = "<p style='color:red;'>Datos inválidos. Asegúrate de llenar todos los campos correctamente.</p>";
      return;
    }

    // Calcular términos de la sucesión
    for (let k = m; k <= n; k++) {
      try {
        // Reemplazar la variable 'k' por su valor actual y evaluar
        const valor = eval(formula.replace(/k/g, `(${k})`));
        if (typeof valor !== 'number' || isNaN(valor)) throw "No es un número";
        sucesion.push(valor);
      } catch (error) {
        resultadosDiv.innerHTML = `<p style='color:red;'>Error al evaluar la fórmula en k=${k}. Verifica la fórmula.</p>`;
        return;
      }
    }

    // Mostrar los términos
    let html = `<h3>Términos de la sucesión:</h3><ul>`;
    for (let i = 0; i < sucesion.length; i++) {
      html += `<li>a<sub>${m + i}</sub> = ${sucesion[i].toFixed(6)}</li>`;
    }
    html += `</ul>`;

    // Recursión: suma y multiplicación
    function sumaRecursiva(arr, i = 0) {
      if (i >= arr.length) return 0;
      return arr[i] + sumaRecursiva(arr, i + 1);
    }

    function multRecursiva(arr, i = 0) {
      if (i >= arr.length) return 1;
      return arr[i] * multRecursiva(arr, i + 1);
    }

    const suma = sumaRecursiva(sucesion);
    const producto = multRecursiva(sucesion);

    html += `<h3>Resultados:</h3>`;
    html += `<p>Sumatoria: <strong>${suma.toFixed(6)}</strong></p>`;
    html += `<p>Multiplicación: <strong>${producto.toExponential(6)}</strong></p>`;

    resultadosDiv.innerHTML = html;
  }