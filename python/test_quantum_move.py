from quantum_game import QuantumMove

# Create a quantum move
move = QuantumMove(
    move_id="X1",
    player="X",
    squares=[0, 4]
)

print(f"Move ID: {move.move_id}")
print(f"Player: {move.player}")
print(f"Squares: {move.squares}")
print(f"Circuit created: {move.circuit is not None}")
print(f"\nQuantum Circuit:")
print(move.circuit)