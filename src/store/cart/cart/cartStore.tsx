// Importamos la interfaz CartProduct que define la forma de los productos en el carrito
import { CartProduct } from "@/interfaces/product.interface";

// Importamos la función create de la librería Zustand para crear el store
import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
// Definimos la interfaz del estado del store
interface State {
  cart: CartProduct[]; // El estado principal: un array de productos en el carrito

  // Función para agregar productos al carrito (también maneja actualización)
  addProductTocart: (product: CartProduct) => void;
  getTotalItems: () => number;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProductToCart: (product: CartProduct) => void;
  getSummaryInformation: () => {
    subTotal: number;
    taxRate: number;
    total: number;
    totalItem: number;
  };
  cleanCart: () => void;
}

type MyPersist = (
  config: StateCreator<State>,
  options: PersistOptions<State>
) => StateCreator<State>;
// Creamos el store con Zustand usando la función create
export const useCartStore = create<State>(
  (persist as MyPersist)(
    (set, get) => ({
      cart: [], // Estado inicial del carrito: vacío

      /////metodos
      cleanCart: () => {
        set({ cart: [] }); // Limpia el carrito estableciendo un array vacío
      },

      getSummaryInformation: () => {
        const { cart } = get();
        const subTotal = cart.reduce((acc, product) => {
          return acc + product.price * product.quantity;
        }, 0);
        const taxRate = subTotal * 0.19;
        const total = taxRate + subTotal;

        const totalItem = cart.reduce((total, item) => {
          return total + item.quantity;
        }, 0);
        return { subTotal, taxRate, total, totalItem };
      },
      getTotalItems: () => {
        const { cart } = get();

        const totalItem = cart.reduce((total, item) => {
          return total + item.quantity;
        }, 0);
        return totalItem;
      },

      // Método para agregar un producto al carrito
      addProductTocart: (product: CartProduct) => {
        const { cart } = get(); // Obtenemos el estado actual del carrito

        // Verificamos si el producto ya existe en el carrito con la misma talla (size)
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        // Si el producto no existe, lo agregamos directamente al carrito
        if (!productInCart) {
          set({ cart: [...cart, product] }); // Usamos el spread operator para mantener los productos actuales y agregar el nuevo
          return; // Terminamos la función aquí
        }

        // Si el producto ya existe (por ID y talla), actualizamos su cantidad
        const updatedCartProduct = cart.map((item) => {
          // Si encontramos el producto con la misma talla, sumamos la cantidad
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          } else {
            // Si no, dejamos el producto como está
            return item;
          }
        });

        // Actualizamos el estado del carrito con el producto actualizado
        set({ cart: updatedCartProduct });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        // guard against invalid quantity
        if (quantity <= 0) return;
        const updatedCart: CartProduct[] = cart.map((item) => {
          // Si encontramos el producto con la misma talla, sumamos la cantidad
          if (item.id === product.id && item.size === product.size) {
            ////new quantity
            return { ...item, quantity };
          } else {
            // Si no, dejamos el producto como está
            return item;
          }
        });
        set({ cart: updatedCart });
      },
      removeProductToCart: (product: CartProduct) => {
        const { cart } = get();
        const updatedCart = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );
        set({ cart: updatedCart });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
