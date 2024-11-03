
import requests
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, Bidirectional
from dotenv import load_dotenv
import os
import numpy as np
import matplotlib.pyplot as plt
import yfinance as yf

load_dotenv()

api_key = os.getenv("API_KEY")

def create_sequence(dataset, skip, seq_length=30):
    # Using .iloc to handle integer-based indexing for rows
    sequences = [dataset.iloc[i:i+seq_length].values for i in range(len(dataset) - seq_length - skip)]
    labels = [dataset.iloc[i + seq_length + skip - 1].values for i in range(len(dataset) - seq_length - skip)]
    return np.array(sequences), np.array(labels)


def get_prediction(ticker, skip):
    stock = yf.Ticker(ticker)
    df = stock.history(start='2018-11-03', end='2024-09-01', interval='1d').reset_index()

    df_selected = df[["Date", "Open", "Close"]]

    # Removing the time part to show only the date
    df_selected.loc[:, "Date"] = pd.to_datetime(df_selected["Date"]).dt.date

    Ms = MinMaxScaler()
    df_selected.loc[:, ["Open", "Close"]] = Ms.fit_transform(df_selected[["Open", "Close"]])

    training_size = round(len(df_selected) * 0.80)

    train_data = df_selected[:training_size]
    test_data  = df_selected[training_size:]


    train_seq, train_label = create_sequence(train_data[["Open", "Close"]], skip)
    test_seq, test_label = create_sequence(test_data[["Open", "Close"]], skip)

    train_seq_tensor = tf.convert_to_tensor(train_seq, dtype=tf.float32)
    train_label_tensor = tf.convert_to_tensor(train_label, dtype=tf.float32)
    test_seq_tensor = tf.convert_to_tensor(test_seq, dtype=tf.float32)
    test_label_tensor = tf.convert_to_tensor(test_label, dtype=tf.float32)

    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape = (train_seq.shape[1], train_seq.shape[2])))

    model.add(Dropout(0.1)) 
    model.add(LSTM(units=50))

    model.add(Dense(2))

    model.compile(loss='mean_squared_error', optimizer='adam', metrics=['mean_absolute_error'])

    model.summary()

    model.fit(
        train_seq_tensor,
        train_label_tensor,
        epochs=30,
        validation_data=(test_seq_tensor, test_label_tensor),
        verbose=1
    )
                                
    test_predicted = model.predict(test_seq)
    test_inverse_predicted = Ms.inverse_transform(test_predicted)
    print(test_predicted.shape[0])
    df_test_selected = df_selected.iloc[-test_predicted.shape[0]:].copy()  # Select last 61 rows to match test_predicted shape

    # Create a DataFrame for predictions with matching indices
    test_inverse_predicted_df = pd.DataFrame(
        test_inverse_predicted, columns=['Open_predicted', 'Close_predicted'], index=df_test_selected.index
    )

    # Concatenate with only the test subset of df_selected
    df_slic_data = pd.concat([df_test_selected, test_inverse_predicted_df], axis=1)

    df_slic_data[['Open', 'Close']] = Ms.inverse_transform(df_slic_data[['Open', 'Close']])

    # future_predictions = predict_future_prices(df_slic_data, model, Ms, days=60)

    # df_combined = pd.concat([df_slic_data, future_predictions], ignore_index=True)

    # # Plot the Open prices, continuing the line into future predictions
    # plt.figure(figsize=(10, 6))
    # plt.plot(df_combined['Date'], df_combined['Open'], label='Actual Open Price', color='blue')
    # plt.plot(df_combined['Date'], df_combined['Open_predicted'], label='Predicted Open Price', color='orange')
    # plt.xlabel('Timestamp', fontsize=15)
    # plt.ylabel('Stock Price', fontsize=15)
    # plt.title('Actual vs Predicted Open Prices', fontsize=15)
    # plt.xticks(rotation=45)
    # plt.legend()
    # plt.show()

    # # Plot the Close prices, continuing the line into future predictions
    # plt.figure(figsize=(10, 6))
    # plt.plot(df_combined['Date'], df_combined['Close'], label='Actual Close Price', color='blue')
    # plt.plot(df_combined['Date'], df_combined['Close_predicted'], label='Predicted Close Price', color='orange')
    # plt.xlabel('Timestamp', fontsize=15)
    # plt.ylabel('Stock Price', fontsize=15)
    # plt.title('Actual vs Predicted Close Prices', fontsize=15)
    # plt.xticks(rotation=45)
    # plt.legend()
    # plt.show()
    

    return df_slic_data, model, Ms

def predict_future_prices(df, model, scaler, skip, days=1):
    # Get the last sequence of 60 days
    last_sequence = df[["Open", "Close"]].values[-60:]
    last_sequence = scaler.transform(last_sequence)  # Scale the sequence
    predictions = []

    for _ in range(days):
        # Reshape to fit model input (1, time_steps, features)
        input_sequence = last_sequence.reshape(1, 60, 2)
        next_day_scaled = model.predict(input_sequence)

        # Inverse scale the prediction to original values
        next_day = scaler.inverse_transform(next_day_scaled)[0]
        predictions.append(next_day)

        # Append the prediction to the sequence for next iteration
        next_day_scaled = next_day_scaled.reshape(1, 2)  # Reshape for concatenation
        last_sequence = np.concatenate([last_sequence[1:], next_day_scaled], axis=0)

    # Create a DataFrame for future predictions
    future_dates = pd.date_range(df["Date"].iloc[-1] + pd.Timedelta(days=skip), periods=days)
    future_predictions = pd.DataFrame(future_dates, columns=["Date"])
    future_predictions[["Open_predicted", "Close_predicted"]] = predictions

    return future_predictions

predictions = []
df_real = 0
for i in range(1, 31, 1):
    df_selected, model, Ms = get_prediction("AAPL", i)
    if i == 1:
        df_real = df_selected
    pred = predict_future_prices(df_selected, model, Ms, i)
    predictions.append(pred)
print(predictions)
print(df_real)

stock = yf.Ticker('AAPL')
df_test = stock.history(start='2018-11-03', end='2024-11-01', interval='1d').reset_index()
df_test = df_test[int(len(df_test) * 0.80):].reset_index(drop=True)

df_predictions = pd.concat(predictions, ignore_index=True)
df_combined = pd.concat([df_real, df_predictions], ignore_index=True)

# Plot Open and Open_predicted curves
plt.figure(figsize=(10, 6))
plt.plot(df_test['Date'], df_test['Open'], label='Actual Open Price', color='blue')
plt.plot(df_predictions['Date'], df_predictions['Open_predicted'], label='Predicted Open Price', color='orange')
plt.xlabel('Date')
plt.ylabel('Stock Price')
plt.title('Actual vs Predicted Open Prices')
plt.xticks(rotation=45)
plt.legend()
plt.show()

plt.figure(figsize=(10, 6))
plt.plot(df_combined['Date'], df_combined['Close'], label='Actual Close Price', color='blue')
plt.plot(df_combined['Date'], df_combined['Close_predicted'], label='Predicted Open Price', color='orange')
plt.xlabel('Date')
plt.ylabel('Stock Price')
plt.title('Actual vs Predicted Close Prices')
plt.xticks(rotation=45)
plt.legend()
plt.show()



