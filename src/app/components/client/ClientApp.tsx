// src/app/components/client/ClientApp.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useNavigation } from "./hooks/useNavigation";
import { useCart } from "./hooks/useCart";
import { useGeolocation } from "./hooks/useGeolocation";

import { WelcomeScreen } from "./screens/WelcomeScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { CartScreen } from "./screens/CartScreen";
import { GeolocationScreen } from "./screens/GeolocationScreen";
import { OutOfRangeScreen } from "./screens/OutOfRangeScreen";
import { TrackingScreen } from "./screens/TrackingScreen";

import { screenOrder } from "./constants";
import type { OrderStatus } from "./types";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export function ClientApp() {
  const { screen, prevScreen, navigate, direction } = useNavigation();
  const { cart, count, total, addToCart, updateQty, removeItem, updateNote, clearCart } = useCart();
  const { getLocation, checkDistance, loading: geoLoading } = useGeolocation();

  const [clientName, setClientName] = useState("");
  const [orderStatus] = useState<OrderStatus>("preparing");
  const [orderId] = useState(`CMD-${Math.floor(Math.random() * 900) + 100}`);
  const [geoChecking, setGeoChecking] = useState(false);

  const handleGeoCheck = async () => {
    setGeoChecking(true);
    try {
      const position = await getLocation();
      const isInRange = checkDistance(position, 5.345317, -4.024429, 100);
      if (isInRange) {
        navigate("tracking");
      } else {
        navigate("out_of_range");
      }
    } catch (error) {
      navigate("out_of_range");
    } finally {
      setGeoChecking(false);
    }
  };

  const dir = screenOrder.indexOf(screen) > screenOrder.indexOf(prevScreen) ? 1 : -1;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden relative">
      <AnimatePresence mode="wait" custom={dir}>
        {screen === "welcome" && (
          <motion.div
            key="welcome"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <WelcomeScreen onStart={() => navigate("menu")} />
          </motion.div>
        )}

        {screen === "menu" && (
          <motion.div
            key="menu"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <MenuScreen
              cart={cart}
              cartCount={count}
              cartTotal={total}
              onAddToCart={addToCart}
              onUpdateQty={updateQty}
              onViewCart={() => navigate("cart")}
              onBack={() => navigate("welcome")}
            />
          </motion.div>
        )}

        {screen === "cart" && (
          <motion.div
            key="cart"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <CartScreen
              cart={cart}
              cartCount={count}
              cartTotal={total}
              clientName={clientName}
              onUpdateClientName={setClientName}
              onUpdateQty={updateQty}
              onRemoveItem={removeItem}
              onUpdateNote={updateNote}
              onCheckout={() => navigate("geolocation")}
              onBack={() => navigate("menu")}
            />
          </motion.div>
        )}

        {screen === "geolocation" && (
          <motion.div
            key="geo"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <GeolocationScreen
              checking={geoChecking || geoLoading}
              onAllowLocation={handleGeoCheck}
            />
          </motion.div>
        )}

        {screen === "out_of_range" && (
          <motion.div
            key="outofrange"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <OutOfRangeScreen
              onRetry={() => navigate("geolocation")}
              onCallWaiter={() => {
                toast.info("🔔 Le serveur arrive !");
              }}
            />
          </motion.div>
        )}

        {screen === "tracking" && (
          <motion.div
            key="tracking"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <TrackingScreen
              orderId={orderId}
              cart={cart}
              cartTotal={total}
              status={orderStatus}
              onCallWaiter={() => {
                toast.info("🔔 Le serveur arrive !");
              }}
              onRequestBill={() => {
                toast.info("🧾 L'addition arrive !");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}