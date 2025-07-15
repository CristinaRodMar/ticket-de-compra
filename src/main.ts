type TipoIva =
    | "general"
    | "reducido"
    | "superreducidoA"
    | "superreducidoB"
    | "superreducidoC"
    | "sinIva";

interface Producto {
    nombre: string;
    precio: number;
    tipoIva: TipoIva;
}

interface LineaTicket {
    producto: Producto;
    cantidad: number;
}

interface ResultadoLineaTicket {
    nombre: string;
    cantidad: number;
    precioSinIva: number;
    tipoIva: TipoIva;
    precioConIva: number;
}

interface ResultadoTotalTicket {
    totalSinIva: number;
    totalConIva: number;
    totalIva: number;
}

interface TotalPorTipoIva {
    tipoIva: TipoIva; // Corregido: TipoIVA -> TipoIva
    cuantia: number;
}

interface TicketFinal {
    lineas: ResultadoLineaTicket[];
    total: ResultadoTotalTicket;
    desgloseIva: TotalPorTipoIva[];
}

const productos: LineaTicket[] = [
    {
    producto: {
        nombre: "Legumbres",
        precio: 2,
        tipoIva: "general",
    },
    cantidad: 2,
    },
    {
    producto: {
        nombre: "Perfume",
        precio: 20,
        tipoIva: "general",
    },
    cantidad: 3,
    },
    {
    producto: {
        nombre: "Leche",
        precio: 1,
        tipoIva: "superreducidoC",
    },
    cantidad: 6,
    },
    {
    producto: {
        nombre: "Lasaña",
        precio: 5,
        tipoIva: "superreducidoA",
    },
    cantidad: 1,
    },
];

const obtenerPorcentajeIva = (tipoIva: TipoIva): number => {
    switch (tipoIva) {
    case "general":
        return 21;
    case "reducido":
        return 10;
    case "superreducidoA":
        return 5;
    case "superreducidoB":
        return 4;
    case "superreducidoC":
        return 0;
    case "sinIva":
        return 0;
    default:
        return 0;
    }
};

const calcularLineaTicket = (linea: LineaTicket): ResultadoLineaTicket => {
    const precioSinIva = linea.producto.precio * linea.cantidad;
    const porcentajeIva = obtenerPorcentajeIva(linea.producto.tipoIva);
    const iva = (precioSinIva * porcentajeIva) / 100;
    const precioConIva = Number((precioSinIva + iva).toFixed(2));
        return {
            nombre: linea.producto.nombre,
            cantidad: linea.cantidad,
            precioSinIva: Number(precioSinIva.toFixed(2)),
            tipoIva: linea.producto.tipoIva,
            precioConIva,
        };
};

const calcularTotalSinIva = (lineas: ResultadoLineaTicket[]): number => Number(lineas.reduce((acc, linea) => acc + linea.precioSinIva, 0).toFixed(2));

const calcularDesgloseIva = (lineas: ResultadoLineaTicket[]): TotalPorTipoIva[] => lineas.reduce((acc: TotalPorTipoIva[], linea) => {
    const existeTipoIva = acc.find((item) => item.tipoIva === linea.tipoIva);
    const cuantia = Number( ((linea.precioSinIva * obtenerPorcentajeIva(linea.tipoIva)) / 100).toFixed(2) );
        if (existeTipoIva) {
            existeTipoIva.cuantia += cuantia;
        } else {
            acc.push({
            tipoIva: linea.tipoIva,
            cuantia,
            });
        }
    return acc;
}, []);

const calcularTotalIva = (desgloseIva: TotalPorTipoIva[]): number => Number(desgloseIva.reduce((acc, item) => acc + item.cuantia, 0).toFixed(2));

const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
    const lineas = lineasTicket.map(calcularLineaTicket);
    const totalSinIva = calcularTotalSinIva(lineas);
    const desgloseIva = calcularDesgloseIva(lineas);
    const totalIva = calcularTotalIva(desgloseIva);
    const totalConIva = Number((totalSinIva + totalIva).toFixed(2));

    return { lineas, total: { totalSinIva, totalConIva, totalIva }, desgloseIva };
};
