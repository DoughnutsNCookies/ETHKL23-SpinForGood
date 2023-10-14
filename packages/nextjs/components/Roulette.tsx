import React, { useEffect, useState } from "react";
import ButtonMarquee from "./ButtonMarquee";
import { Wheel } from "react-custom-roulette";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { formattedAddress } from "~~/utils/formatAddress";

export default function Roulette() {
  const [spin, setSpin] = useState(false);
  const [NPOWinner, setNPOWinner] = useState(0);
  const [donorWinner, setDonorWinner] = useState(0);
  const [donors, setDonors] = useState<any[]>([]);
  const [npos, setNPOs] = useState<any[]>([]);

  const { data: qDonorWinner } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "lastUserWinner",
  });

  const { data: qNPOWinner } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "lastNPOWinner",
  });

  const { data: qDonors } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getListOfDonors",
  });

  const { data: qNPOs } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getListOfNPOs",
  });

  useEffect(() => {
    if (qDonors) {
      const newDonors = qDonors.map(donor => {
        return {
          ...donor,
          option: formattedAddress(donor.user),
        };
      });
      newDonors.sort((a, b) => Number(b.amount - a.amount));
      setDonors(newDonors);
    }
  }, [qDonors]);

  useEffect(() => {
    if (qNPOs) {
      const newNPOs = qNPOs.map(npo => {
        return {
          ori: npo.addr,
          option: npo.name,
        };
      });
      setNPOs(newNPOs);
    }
  }, [qNPOs]);

  useEffect(() => {
    if (qDonorWinner && donors.length) {
      const index = donors.findIndex(ele => ele.user === qDonorWinner);
      // if (index === -1) notification.error("Winner can't be found");
      setDonorWinner(index);
    }
  }, [qDonorWinner, donors]);

  useEffect(() => {
    if (qNPOWinner && npos.length) {
      const index = npos.findIndex(ele => ele.ori === qNPOWinner);

      setNPOWinner(index);
    }
  }, [qNPOWinner, npos]);

  return (
    <div className="py-10 flex flex-col justify-center items-center">
      {donors?.length && npos?.length ? (
        <>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold">✨ Donor ✨</span>
              <Wheel
                mustStartSpinning={spin}
                prizeNumber={donorWinner} // the winning address
                data={donors}
                backgroundColors={["#70d6ff", "#ff70a6", "#ff9770", "#ffd670"]}
                textColors={["#ffffff"]}
                outerBorderColor="#fff"
                radiusLineColor="#fff"
                // perpendicularText={true}
                textDistance={60}
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold"> 🎉 NPO 🎉</span>
              <Wheel
                mustStartSpinning={spin}
                prizeNumber={NPOWinner} // the winning address
                data={npos}
                backgroundColors={["#70d6ff", "#ff70a6", "#ff9770", "#ffd670"]}
                textColors={["#ffffff"]}
                outerBorderColor="#fff"
                radiusLineColor="#fff"
                // perpendicularText={true}
                textDistance={60}
                onStopSpinning={() => setSpin(false)}
              />
            </div>
          </div>

          <ButtonMarquee text="Spin" isLoading={spin} onClick={() => setSpin(true)} />
        </>
      ) : (
        <p>Roulette cannot show without </p>
      )}
    </div>
  );
}
